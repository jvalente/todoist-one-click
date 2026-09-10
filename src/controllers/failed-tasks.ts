import FailedTasks from '../models/failed-tasks'
import { addTask } from './task'
import type { FailedTask } from '../types/tasks.type'

export function discardFailedTask(failedTask?: FailedTask) {
    if (!failedTask) return

    return FailedTasks.discard(failedTask.id)
}

export async function retryFailedTask(failedTask?: FailedTask) {
    if (!failedTask?.task.title || !failedTask.task.url) return

    const added = await addTask(failedTask.task.title, failedTask.task.url, {
        recordFailure: false,
    })

    if (added) return FailedTasks.discard(failedTask.id)
}
