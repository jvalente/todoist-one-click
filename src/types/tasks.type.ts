import type { ModelState } from '../models/model'

export type Task = {
    title: string
    url?: string
}

export type FailedTask = {
    id: string
    task: Task
    error: unknown
}

export type FailedTasksState = ModelState<Array<FailedTask>>
