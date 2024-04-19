import Model from './model'

class DueDateModel extends Model<string> {
    constructor() {
        super('dueDate')
    }
}

const DueDate = new DueDateModel()

export default DueDate
