import Model from './model'
import { Task } from './task'

class FailedTasksModel extends Model<any> {
    constructor() {
        super('failedTasks')
    }

    add(task: Task, error: unknown) {
        const id = crypto.randomUUID()

        this.get()
            .then((failedTasks) => {
                this.set([...(failedTasks || []), { id, task, error }])
            })
            .catch(() => {
                // TODO: Model/Storage error handling
                // we need some kind of "global" error handling entity?
            })
    }

    discard(id: string): void {
        this.get().then((failedTasks) => {
            this.set(failedTasks?.filter((task: any) => task.id !== id))
        })
    }
}

const FailedTasks = new FailedTasksModel()

export default FailedTasks
