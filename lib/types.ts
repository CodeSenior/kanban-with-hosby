export interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  assignee: string
  createdAt?: string
  updatedAt?: string
}

export interface Column {
  id: string
  label: string
  title: string
  color: string
  createdAt?: string
  updatedAt?: string
}
