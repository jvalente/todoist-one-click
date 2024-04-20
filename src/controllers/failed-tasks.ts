import FailedTasks from '../models/failed-tasks'
import { addTask } from './task'

export function discardFailedTask(id: string) {
    FailedTasks.discard(id)
}

export function retryFailedTask(failedTask: any) {
    // TODO: handle more elegantly
    FailedTasks.discard(failedTask.id)
    addTask(failedTask.task?.title, failedTask.task?.url)
}
