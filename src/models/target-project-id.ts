import Model from './model'

class TargetProjectIdModel extends Model<string> {
    constructor() {
        super('targetProjectId')
    }
}

const TargetProjectId = new TargetProjectIdModel()

export default TargetProjectId
