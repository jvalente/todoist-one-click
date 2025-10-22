import { RuleMatchMode } from '../types/rules.types'
import Model from './model'
import type { Rule } from '../types/rules.types'

const DEFAULT_RULE: Rule = {
    id: crypto.randomUUID(),
    name: 'default',
    default: true,
    matchMode: RuleMatchMode.Contains,
    dueDate: 'today',
}

class RulesModel extends Model<Array<Rule>> {
    constructor() {
        super('rules', {
            defaultState: [{ ...DEFAULT_RULE }],
        })
    }

    updateDefault(ruleParams: Partial<Rule>): void {
        this.get().then((rules) => {
            let updated = false

            const updatedRules = rules?.map((rule) => {
                if (rule.default) {
                    updated = true
                    return { ...rule, ...ruleParams }
                }
                return rule
            })

            if (updated) {
                this.set(updatedRules)
            } else {
                this.set([
                    ...(updatedRules || []),
                    { ...DEFAULT_RULE, ...ruleParams },
                ])
            }
        })
    }

    getDefault() {
        return this.get().then(
            (rules) => rules?.find((rule) => rule.default) || DEFAULT_RULE,
        )
    }

    contains(rule: Rule, url: string) {
        return (
            rule.matchMode === RuleMatchMode.Contains &&
            rule.query &&
            url.includes(rule.query)
        )
    }

    isExactly(rule: Rule, url: string) {
        return (
            rule.matchMode === RuleMatchMode.Exact &&
            rule.query?.toLocaleLowerCase() === url.toLocaleLowerCase()
        )
    }

    getByUrl(url: string) {
        return this.get().then((rules) => {
            const rule = rules?.find((rule) => {
                if (this.contains(rule, url) || this.isExactly(rule, url)) {
                    return rule
                }
                return null
            })

            return rule || this.getDefault()
        })
    }

    addRule(ruleParams: Omit<Rule, 'id'>) {
        const rule = { ...ruleParams, id: crypto.randomUUID() }

        this.get().then((rules) => {
            this.set([...(rules || []), rule])
        })
    }

    updateRule(ruleParams: Partial<Rule>) {
        this.get().then((rules) => {
            this.set(
                (rules || []).map((rule) => {
                    if (rule.id === ruleParams.id) {
                        return { ...rule, ...ruleParams }
                    }
                    return rule
                }),
            )
        })
    }

    deleteRule(ruleId: Rule['id']) {
        this.get().then((rules) => {
            this.set((rules || []).filter((rule) => rule.id !== ruleId))
        })
    }
}

const Rules = new RulesModel()

export default Rules
