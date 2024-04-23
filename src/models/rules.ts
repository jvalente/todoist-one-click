import { Rule } from '../types/rules.types'
import Model from './model'

const DEFAULT_RULE: Rule = {
    id: crypto.randomUUID(),
    default: true,
    matchMode: 'contains',
    dueDate: 'today',
}

class RulesModel extends Model<Array<Rule>> {
    constructor() {
        super('rules', {
            defaultState: [
                {
                    id: crypto.randomUUID(),
                    default: true,
                    matchMode: 'contains',
                    dueDate: 'today',
                    labels: [],
                },
            ],
        })
    }

    updateDefault(ruleParams: Partial<Rule>): void {
        this.get().then((rules) => {
            const updatedRules = rules?.map((rule) => {
                if (rule.default) {
                    return { ...rule, ...ruleParams }
                }
                return rule
            })
            this.set(updatedRules)
        })
    }

    getDefault() {
        return this.get().then(
            (rules) => rules?.find((rule) => rule.default) || DEFAULT_RULE
        )
    }
}

const Rules = new RulesModel()

export default Rules
