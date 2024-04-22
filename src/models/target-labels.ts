import Model from './model'

class TargetLabelsModel extends Model<Array<string>> {
    constructor() {
        super('targetLabels')
    }
}

const TargetLabels = new TargetLabelsModel()

export default TargetLabels
