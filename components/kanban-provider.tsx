"use client"

import type React from "react"

import { createContext, useContext, useEffect, useReducer } from "react"
import type { Task, Column } from "@/lib/types"
import { mockTasks } from "@/lib/mock-data"
import { toast } from "react-hot-toast"
import { KanbanService } from "@/lib/hosby.service"

type KanbanState = {
  tasks: Task[]
  columns: Column[]
}

type KanbanAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; task: Task }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "MOVE_TASK"; taskId: string; sourceColumn: string; destinationColumn: string }
  | { type: "ADD_COLUMN"; column: Column }
  | { type: "UPDATE_COLUMN"; column: Column }
  | { type: "DELETE_COLUMN"; columnId: string }
  | { type: "LOAD_DATA"; data: KanbanState }

type KanbanContextType = {
  state: KanbanState
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, sourceColumn: string, destinationColumn: string) => void
  addColumn: (column: Omit<Column, "label">) => void
  updateColumn: (column: Column) => void
  deleteColumn: (columnId: string) => void
  saveData: () => void
  loadData: () => void
}

// const defaultColumns: Column[] = [
//   { id: "todo", title: "To Do", color: "bg-blue-500" },
//   { id: "in-progress", title: "In Progress", color: "bg-yellow-500" },
//   { id: "done", title: "Done", color: "bg-green-500" },
// ]

const initialState: KanbanState = {
  tasks: [],
  columns: [],
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined)

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
      }
    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.taskId) {
            return { ...task, status: action.destinationColumn }
          }
          return task
        }),
      }
    case "ADD_COLUMN":
      return {
        ...state,
        columns: [...state.columns, action.column],
      }
    case "UPDATE_COLUMN":
      return {
        ...state,
        columns: state.columns.map((column) => (column.id === action.column.id ? action.column : column)),
      }
    case "DELETE_COLUMN":
      // When deleting a column, we need to handle its tasks
      // For now, we'll delete the tasks in that column
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== action.columnId),
        tasks: state.tasks.filter((task) => task.status !== action.columnId),
      }
    case "LOAD_DATA":
      return action.data
    default:
      return state
  }
}

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, {
    ...initialState,
    tasks: [],
  })

  useEffect(() => {
    const kanbanService = new KanbanService()
    
    Promise.all([
      kanbanService.getAllTasks(),
      kanbanService.getAllColumns()
    ])
      .then(([tasks, columns]) => {
        dispatch({ type: "LOAD_DATA", data: { ...state, tasks, columns } })
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      })
  }, [])

  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
    }
    dispatch({ type: "ADD_TASK", task: newTask })
    toast.success("Task added successfully")
  }

  const updateTask = (task: Task) => {
    dispatch({ type: "UPDATE_TASK", task })
    toast.success("Task updated successfully")
  }

  const deleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", taskId })
    toast.success("Task deleted successfully")
  }

  const moveTask = (taskId: string, sourceColumn: string, destinationColumn: string) => {
    // Validate that the destination column exists
    const destinationColumnExists = state.columns.some((col) => col.label === destinationColumn)

    if (!destinationColumnExists) {
      toast.error(`Column "${destinationColumn}" does not exist`)
      return
    }

    dispatch({ type: "MOVE_TASK", taskId, sourceColumn, destinationColumn })

    const columnTitle = state.columns.find((c) => c.label === destinationColumn)?.title || destinationColumn
    toast.success(`Task moved to ${columnTitle}`)
  }

  const addColumn = (columnData: Omit<Column, "label">) => {
    // Create a slug from the title for the ID
    const label = columnData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    // Check if ID already exists
    if (state.columns.some((col) => col.label === label)) {
      toast.error("A column with a similar name already exists")
      return
    }

    const newColumn: Column = {
      label,
      ...columnData,
    }
    dispatch({ type: "ADD_COLUMN", column: newColumn })
    toast.success("Column added successfully")
  }

  const updateColumn = (column: Column) => {
    dispatch({ type: "UPDATE_COLUMN", column })
    toast.success("Column updated successfully")
  }

  const deleteColumn = (columnId: string) => {
    dispatch({ type: "DELETE_COLUMN", columnId })
    toast.success("Column deleted successfully")
  }

  const saveData = () => {
    if (typeof window !== "undefined") {
      console.log("saving data", state)
      localStorage.setItem("kanban-data", JSON.stringify(state))
      toast.success("Project data saved successfully")
    }
  }

  const loadData = () => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("kanban-data")
      if (savedData) {
        dispatch({ type: "LOAD_DATA", data: JSON.parse(savedData) })
        toast.success("Project data loaded successfully")
      } else {
        toast.error("No saved data found")
      }
    }
  }

  return (
    <KanbanContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addColumn,
        updateColumn,
        deleteColumn,
        saveData,
        loadData,
      }}
    >
      {children}
    </KanbanContext.Provider>
  )
}

export function useKanban() {
  const context = useContext(KanbanContext)
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider")
  }
  return context
}
