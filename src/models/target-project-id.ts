import Model from './model.js'

class TargetProjectIdModel extends Model<any> {
    constructor() {
        super('targetProjectId')
    }
}

const TargetProjectId = new TargetProjectIdModel()

export default TargetProjectId
