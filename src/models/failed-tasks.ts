import { TodoistAPIError } from '../api/todoist'
import Model from './model'
import type { FailedTask } from '../types/tasks.type'

class FailedTasksModel extends Model<Array<FailedTask>> {
    constructor() {
        super('failedTasks')
    }

    add(task: FailedTask['task'], error: FailedTask['error']) {
        const id = crypto.randomUUID()

        const serializedError =
            error instanceof TodoistAPIError ? error.serialize() : error

        this.get()
            .then((failedTasks) => {
                this.set([
                    ...(failedTasks || []),
                    { id, task, error: serializedError },
                ])
            })
            .catch(() => {
                // TODO: Model/Storage error handling
                // we need some kind of "global" error handling entity?
            })
    }

    discard(id: FailedTask['id']): void {
        this.get().then((failedTasks) => {
            this.set(failedTasks?.filter((failedTask) => failedTask.id !== id))
        })
    }
}

const FailedTasks = new FailedTasksModel()

export default FailedTasks
