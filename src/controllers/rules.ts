import Rules from '../models/rules'
import type { Rule } from '../types/rules.types'

export function updateDefaultRule(ruleParams: Partial<Rule>) {
    Rules.updateDefault(ruleParams)
}

export function addRule(ruleParams: Omit<Rule, 'id'>) {
    // validate query must exist
    Rules.addRule(ruleParams)
}

export function updateRule(ruleParams: Partial<Rule>) {
    // validate query must exist
    Rules.updateRule(ruleParams)
}

export function deleteRule(ruleId: Rule['id']) {
    // validate cannot delete default
    Rules.deleteRule(ruleId)
}
