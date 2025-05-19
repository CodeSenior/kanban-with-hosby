import { Suspense } from "react"
import KanbanBoard from "@/components/kanban-board"
import { KanbanProvider } from "@/components/kanban-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "react-hot-toast"

export default function HomePage() {
  return (
    <main className="mx-auto py-6 px-4 bg-[#d9e6fe] h-screen w-full overflow-y-auto max-h-screen">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>
      <KanbanProvider>
        <Suspense fallback={<BoardSkeleton />}>
          <KanbanBoard />
        </Suspense>
      </KanbanProvider>
      <Toaster position="bottom-right" />
    </main>
  )
}

function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-8 w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-32 w-full mb-3 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  )
}
