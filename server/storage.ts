import {
  users,
  projects,
  projectMembers,
  tasks,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type ProjectMember,
  type InsertProjectMember,
  type ProjectWithDetails,
  type TaskWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Project operations
  getProjects(userId: string): Promise<ProjectWithDetails[]>;
  getProject(id: string, userId: string): Promise<ProjectWithDetails | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, userId: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;

  // Task operations
  getTasks(projectId: string, userId: string): Promise<TaskWithDetails[]>;
  getTask(id: string, userId: string): Promise<TaskWithDetails | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;

  // Project member operations
  addProjectMember(member: InsertProjectMember): Promise<ProjectMember>;
  removeProjectMember(projectId: string, userId: string): Promise<boolean>;
  getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<ProjectWithDetails[]> {
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.ownerId, userId),
      orderBy: [desc(projects.createdAt)],
      with: {
        owner: true,
        members: {
          with: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    return userProjects as ProjectWithDetails[];
  }

  async getProject(id: string, userId: string): Promise<ProjectWithDetails | undefined> {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, id), eq(projects.ownerId, userId)),
      with: {
        owner: true,
        members: {
          with: {
            user: true,
          },
        },
        tasks: {
          with: {
            assignee: true,
          },
        },
      },
    });

    return project as ProjectWithDetails | undefined;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();

    // Add owner as a member automatically
    await db.insert(projectMembers).values({
      projectId: project.id,
      userId: projectData.ownerId,
      role: 'manager',
    });

    return project;
  }

  async updateProject(id: string, userId: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.ownerId, userId)))
      .returning();

    return project;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.ownerId, userId)))
      .returning();

    return result.length > 0;
  }

  // Task operations
  async getTasks(projectId: string, userId: string): Promise<TaskWithDetails[]> {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.ownerId, userId)),
    });

    if (!project) {
      return [];
    }

    const projectTasks = await db.query.tasks.findMany({
      where: eq(tasks.projectId, projectId),
      with: {
        assignee: true,
        project: true,
      },
      orderBy: [desc(tasks.createdAt)],
    });

    return projectTasks as TaskWithDetails[];
  }

  async getTask(id: string, userId: string): Promise<TaskWithDetails | undefined> {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: {
        assignee: true,
        project: true,
      },
    });

    if (!task) {
      return undefined;
    }

    // Verify user owns the project
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, task.projectId), eq(projects.ownerId, userId)),
    });

    if (!project) {
      return undefined;
    }

    return task as TaskWithDetails;
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    // Calculate AI score based on priority and due date
    const aiScore = this.calculateAIScore(taskData);

    const [task] = await db
      .insert(tasks)
      .values({ ...taskData, aiScore })
      .returning();

    return task;
  }

  async updateTask(id: string, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    // First get the task to verify ownership
    const existingTask = await this.getTask(id, userId);
    if (!existingTask) {
      return undefined;
    }

    // Recalculate AI score if priority or due date changed
    const aiScore = (updates.priority || updates.dueDate)
      ? this.calculateAIScore({ ...existingTask, ...updates })
      : existingTask.aiScore;

    const [task] = await db
      .update(tasks)
      .set({ ...updates, aiScore, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    return task;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const existingTask = await this.getTask(id, userId);
    if (!existingTask) {
      return false;
    }

    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    return result.length > 0;
  }

  // Project member operations
  async addProjectMember(memberData: InsertProjectMember): Promise<ProjectMember> {
    const [member] = await db
      .insert(projectMembers)
      .values(memberData)
      .returning();

    return member;
  }

  async removeProjectMember(projectId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(projectMembers)
      .where(and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      ))
      .returning();

    return result.length > 0;
  }

  async getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]> {
    const members = await db.query.projectMembers.findMany({
      where: eq(projectMembers.projectId, projectId),
      with: {
        user: true,
      },
    });

    return members as (ProjectMember & { user: User })[];
  }

  // AI Task Prioritization Algorithm
  private calculateAIScore(task: Partial<InsertTask>): number {
    let score = 50; // Base score

    // Priority weight (30 points max)
    if (task.priority === 'high') {
      score += 30;
    } else if (task.priority === 'medium') {
      score += 15;
    }

    // Due date urgency (20 points max)
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {
        // Overdue
        score += 20;
      } else if (daysUntilDue <= 1) {
        // Due today or tomorrow
        score += 18;
      } else if (daysUntilDue <= 3) {
        // Due within 3 days
        score += 15;
      } else if (daysUntilDue <= 7) {
        // Due within a week
        score += 10;
      } else if (daysUntilDue <= 14) {
        // Due within 2 weeks
        score += 5;
      }
    }

    // Ensure score is between 0-100
    return Math.min(100, Math.max(0, score));
  }
}

export const storage = new DatabaseStorage();
