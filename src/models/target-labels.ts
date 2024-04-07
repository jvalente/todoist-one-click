import Model from './model'

class TargetLabelsModel extends Model<any> {
    constructor() {
        super('targetLabels')
    }
}

const TargetLabels = new TargetLabelsModel()

export default TargetLabels
