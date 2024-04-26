import Rules from '../models/rules'
import type { Rule } from '../types/rules.types'

export function updateDefaultRule(ruleParams: Partial<Rule>) {
    Rules.updateDefault(ruleParams)
}
