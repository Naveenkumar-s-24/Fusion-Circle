import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Users } from "lucide-react";
import type { ProjectWithDetails } from "@shared/schema";

interface ProjectHeaderProps {
  project: ProjectWithDetails;
  onBack: () => void;
  onNewTask: () => void;
  onManageMembers?: () => void;
}

export function ProjectHeader({ project, onBack, onNewTask, onManageMembers }: ProjectHeaderProps) {
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-2"
        data-testid="button-back-to-projects"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight truncate">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <span>{totalTasks} tasks</span>
            <span>{completedTasks} completed</span>
            <span>{progress}% progress</span>
            <button
              onClick={onManageMembers}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              data-testid="button-manage-members"
            >
              <Users className="h-4 w-4" />
              {project.members?.length || 0} members
            </button>
          </div>
        </div>

        <Button onClick={onNewTask} className="gap-2 flex-shrink-0" data-testid="button-new-task">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>
    </div>
  );
}
