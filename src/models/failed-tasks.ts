import { TodoistAPIError } from '../api/todoist'
import Model from './model'
import type { FailedTask } from '../types/tasks.type'

class FailedTasksModel extends Model<Array<FailedTask>> {
    private pendingUpdate = Promise.resolve()

    constructor() {
        super('failedTasks')
    }

    add(task: FailedTask['task'], error: FailedTask['error']) {
        const id = crypto.randomUUID()
        const serializedError =
            error instanceof TodoistAPIError ? error.serialize() : error

        return this.update((failedTasks) => [
            ...failedTasks,
            { id, task, error: serializedError },
        ])
    }

    discard(id: FailedTask['id']) {
        return this.update((failedTasks) =>
            failedTasks.filter((failedTask) => failedTask.id !== id),
        )
    }

    private update(update: (failedTasks: FailedTask[]) => FailedTask[]) {
        const pendingUpdate = this.pendingUpdate.then(() =>
            this.get().then((failedTasks) =>
                this.set(update(failedTasks || [])),
            ),
        )

        this.pendingUpdate = pendingUpdate.catch(() => undefined)

        return pendingUpdate
    }
}

const FailedTasks = new FailedTasksModel()

export default FailedTasks
