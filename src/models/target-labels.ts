import Model from './model.js'

class TargetLabelsModel extends Model<any> {
    constructor() {
        super('targetLabels')
    }
}

const TargetLabels = new TargetLabelsModel()

export default TargetLabels
