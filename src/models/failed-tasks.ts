import Model from './model'
import { Task } from './task'

class FailedTasksModel extends Model<any> {
    constructor() {
        super('failedTasks')
    }

    add(task: Task, error: unknown) {
        this.get()
            .then((failedTasks) => {
                this.set([...(failedTasks || []), { task, error }])
            })
            .catch(() => {
                // TODO: Model/Storage error handling
                // we need some kind of "global" error handling entity?
            })
    }
}

const FailedTasks = new FailedTasksModel()

export default FailedTasks
