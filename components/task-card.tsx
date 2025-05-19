"use client"

import type { Task } from "@/lib/types"
import { Calendar, User, MoreHorizontal, Clock, Tag, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useKanban } from "./kanban-provider"
import { formatDate } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { KanbanService } from "@/lib/hosby.service"

interface TaskCardProps {
  task: Task
  onEdit: () => void
  isDragging?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}

export default function TaskCard({ task, onEdit, isDragging = false, onDragStart, onDragEnd }: TaskCardProps) {
  const { deleteTask } = useKanban()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  const handleDelete = async (id: string) => {
   try {
       deleteTask(id)
      const kanbanService = new KanbanService()
      await kanbanService.deleteTask(id)
   } catch (error) {
     console.error("Error deleting task:", error)
     toast.error("Failed to delete task")
   }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              draggable
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              data-task-id={task.id}
              data-column-id={task.status}
              className={`shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
                isDragging ? "opacity-40" : ""
              }`}
              onClick={() => setIsDialogOpen(true)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                      }}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(task.id)
                      }} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>

                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(task.dueDate)}
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {task.assignee}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent side="top" className="flex items-center gap-2">
            <span>Click to show details</span>
            <span className="text-muted-foreground">•</span>
            <span>Drag to move</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge className={`${getPriorityColor(task.priority)} text-white text-sm px-3 py-1`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {task.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-muted-foreground">{task.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-sm">Due Date</h4>
                    <p className="text-muted-foreground text-sm">{formatDate(task.dueDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-sm">Assignee</h4>
                    <p className="text-muted-foreground text-sm">{task.assignee}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsDialogOpen(false)
                onEdit()
              }}>
                Edit Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
