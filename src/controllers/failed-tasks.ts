import FailedTasks from '../models/failed-tasks'
import { addTask } from './task'
import type { FailedTask } from '../types/tasks.type'

export function discardFailedTask(failedTask?: FailedTask) {
    if (!failedTask) return

    FailedTasks.discard(failedTask.id)
}

export function retryFailedTask(failedTask?: FailedTask) {
    if (!failedTask) return

    // TODO: handle more elegantly
    FailedTasks.discard(failedTask.id)
    addTask(failedTask.task?.title, failedTask.task?.url)
}
