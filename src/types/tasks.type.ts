type Task = {
    title: string
    url?: string
}

export type FailedTask = {
    id: string
    task: Task
    error: unknown
}
