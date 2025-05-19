import type { Task } from "./types"

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new admin dashboard interface",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    assignee: "Sarah Chen",
  },
  {
    id: "task-2",
    title: "Implement authentication flow",
    description: "Set up user registration, login, and password reset functionality",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    assignee: "Michael Johnson",
  },
  {
    id: "task-3",
    title: "Fix responsive layout issues",
    description: "Address UI bugs on mobile devices and smaller screens",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    assignee: "Alex Rodriguez",
  },
  {
    id: "task-4",
    title: "Write API documentation",
    description: "Document all endpoints, parameters, and response formats",
    status: "todo",
    priority: "low",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    assignee: "Jamie Taylor",
  },
  {
    id: "task-5",
    title: "Optimize database queries",
    description: "Improve performance of slow-running database operations",
    status: "done",
    priority: "medium",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    assignee: "Chris Wong",
  },
  {
    id: "task-6",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment workflow",
    status: "done",
    priority: "high",
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    assignee: "Pat Smith",
  },
]
