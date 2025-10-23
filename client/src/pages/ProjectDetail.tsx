import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectHeader } from "@/components/ProjectHeader";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import type { ProjectWithDetails, TaskWithDetails, User } from "@shared/schema";

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (path: string) => void;
  onTaskUpdate?: (taskId: string, updates: any) => void;
  onTaskCreate?: (projectId: string, taskData: any) => void;
}

export default function ProjectDetail({ projectId, onNavigate, onTaskUpdate, onTaskCreate }: ProjectDetailProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | undefined>();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const { data: project, isLoading } = useQuery<ProjectWithDetails>({
    queryKey: ["/api/projects", projectId],
    enabled: isAuthenticated && !!projectId,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => onNavigate('/projects')}
            className="text-primary hover:underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const members = project.members?.map(m => m.user).filter(Boolean) || [];

  const handleNewTask = () => {
    setSelectedTask(undefined);
    setIsCreatingTask(true);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task: TaskWithDetails) => {
    setSelectedTask(task);
    setIsCreatingTask(false);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (data: any) => {
    if (isCreatingTask && onTaskCreate) {
      onTaskCreate(projectId, data);
    } else if (selectedTask && onTaskUpdate) {
      onTaskUpdate(selectedTask.id, data);
    }
    setIsTaskModalOpen(false);
    setSelectedTask(undefined);
  };

  const handleTaskMove = (taskId: string, newStatus: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      <ProjectHeader
        project={project}
        onBack={() => onNavigate('/projects')}
        onNewTask={handleNewTask}
      />

      <KanbanBoard
        tasks={tasks}
        members={members}
        onTaskClick={handleTaskClick}
        onTaskMove={handleTaskMove}
      />

      <TaskModal
        open={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        members={members}
      />
    </div>
  );
}
