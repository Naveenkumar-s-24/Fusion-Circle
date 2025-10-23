import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Sparkles, GripVertical } from "lucide-react";
import type { TaskWithDetails, User } from "@shared/schema";
import { format } from "date-fns";

interface KanbanBoardProps {
  tasks: TaskWithDetails[];
  members: User[];
  onTaskClick: (task: TaskWithDetails) => void;
  onTaskMove?: (taskId: string, newStatus: string) => void;
}

type Column = {
  id: string;
  title: string;
  status: string;
};

const columns: Column[] = [
  { id: 'todo', title: 'To Do', status: 'todo' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'completed', title: 'Completed', status: 'completed' },
];

export function KanbanBoard({ tasks, members, onTaskClick, onTaskMove }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getColumnTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedTask && onTaskMove) {
      const task = tasks.find(t => t.id === draggedTask);
      if (task && task.status !== status) {
        onTaskMove(draggedTask, status);
      }
    }
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getAssigneeInitials = (assignee?: User) => {
    if (!assignee) return '?';
    if (assignee.firstName && assignee.lastName) {
      return `${assignee.firstName[0]}${assignee.lastName[0]}`.toUpperCase();
    }
    if (assignee.email) {
      return assignee.email.substring(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getColumnTasks(column.status);
        
        return (
          <div
            key={column.id}
            className="min-w-80 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
            data-testid={`kanban-column-${column.status}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  {column.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3 min-h-32">
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm">
                  No tasks
                </div>
              ) : (
                columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onClick={() => onTaskClick(task)}
                    className="cursor-pointer hover-elevate transition-all group"
                    data-testid={`task-card-${task.id}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Drag Handle & Title */}
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5 cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Priority & AI Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs capitalize">
                          {task.priority}
                        </Badge>
                        {task.aiScore && task.aiScore > 70 && (
                          <Badge
                            variant="outline"
                            className="text-xs gap-1 bg-ai/5 border-ai/20 text-ai"
                            title={`AI Priority Score: ${task.aiScore}`}
                          >
                            <Sparkles className="h-3 w-3" />
                            AI {task.aiScore}
                          </Badge>
                        )}
                      </div>

                      {/* Footer: Due Date & Assignee */}
                      <div className="flex items-center justify-between text-xs">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                          </div>
                        )}
                        {task.assignee && (
                          <Avatar className="h-6 w-6 ml-auto">
                            <AvatarImage src={task.assignee.profileImageUrl || undefined} className="object-cover" />
                            <AvatarFallback className="text-xs">
                              {getAssigneeInitials(task.assignee)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
