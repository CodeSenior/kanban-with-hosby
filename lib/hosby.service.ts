import { HosbyClient } from "hosby-ts"
import { Column, Task } from "./types"

export class KanbanService {
  private client: HosbyClient
  private isInitialized = false

  constructor() {
    try {
      // Initialize the Hosby client using the createClient method
      this.client = new HosbyClient({
        baseURL: process.env.NEXT_PUBLIC_HOSBY_BASE_URL || "",
        privateKey: process.env.NEXT_PUBLIC_HOSBY_PRIVATE_KEY || "",
        apiKeyId: process.env.NEXT_PUBLIC_HOSBY_API_KEY_ID || "",
        projectName: process.env.NEXT_PUBLIC_HOSBY_PROJECT_NAME || "",
        projectId: process.env.NEXT_PUBLIC_HOSBY_PROJECT_ID || "",
        userId: process.env.NEXT_PUBLIC_HOSBY_USER_ID || "",
      })
      this.initialize()
    } catch (error) {
      console.error("Error creating Hosby client:", error)
      throw new Error("Failed to create Hosby client. Check your environment variables.")
    }
  }

  private async initialize() {
    if (!this.isInitialized) {
      try {
        await this.client.init()
        console.log("Hosby client initialized:")
        this.isInitialized = true
      } catch (error) {
        console.error("Error initializing Hosby client:", error)
        throw new Error("Failed to initialize Hosby client. Check your connection and credentials.")
      }
    }
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await this.client.find<Task[]>("tasks")
      if (response && response.success) {
        return response.data || []
      } else {
        const errorMessage = response?.message || "Failed to fetch tasks"
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return []
    }
  }

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    try {
      console.log("task======>", task)
      const response = await this.client.insertOne<Task>("tasks", task)
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  }

  async updateTask(task: Partial<Task>): Promise<Task> {
    try {
      const response = await this.client.updateOne<Task>("tasks", task, [{ field: "id", value: task.id }])
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  async updateTaskByStatus(status: string, taskId: string): Promise<Task> {
    try {
      const response = await this.client.updateOne<Task>("tasks", { status: status }, [{ field: "id", value: taskId }])
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  async updateAllTasks(tasks: Task[]): Promise<Task[]> {
    try {
      const response = await this.client.bulkUpdate<Task[]>("tasks", tasks, [])
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to update tasks")
      }
    } catch (error) {
      console.error("Error updating tasks:", error)
      throw error
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const response = await this.client.deleteOne<Task>("tasks", [{ field: "id", value: id }])
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }

  async getAllColumns(): Promise<Column[]> {
    try {
      const response = await this.client.find<Column[]>("columns")
      if (response && response.success) {
        return response.data || []
      } else {
        const errorMessage = response?.message || "Failed to fetch columns"
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error fetching columns:", error)
      return []
    }
  }

  async createColumn(column: Omit<Column, "id">): Promise<Column> {
    try {
      const response = await this.client.insertOne<Column>("columns", column)
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to create column")
      }
    } catch (error) {
      console.error("Error creating column:", error)
      throw error
    }
  }

  async updateAllColumns(columns: Column[]): Promise<Column[]> {
    try {
      const response = await this.client.bulkUpdate<Column[]>("columns", columns, [])
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to update columns")
      }
    } catch (error) {
      console.error("Error updating columns:", error)
      throw error
    }
  }

  async updateColumn(column: Partial<Column>): Promise<Column> {
    try {
      const response = await this.client.updateOne<Column>("columns", column, [{ field: "id", value: column.id }])
      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to update column")
      }
    } catch (error) {
      console.error("Error updating column:", error)
      throw error
    }
  }

  async deleteColumn(id: string): Promise<void> {
    try {
      const response = await this.client.deleteOne<Column>("columns", [{ field: "id", value: id }])
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to delete column")
      }
    } catch (error) {
      console.error("Error deleting column:", error)
      throw error
    }
  }
}
