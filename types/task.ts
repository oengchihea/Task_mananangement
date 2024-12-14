export interface Task {
  id: number
  title: string
  completed: boolean
  important: boolean
  dueDate?: Date
  assignedTo?: string
}

export type TaskGroup = {
  title: string
  tasks: Task[]
}

