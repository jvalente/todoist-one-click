import type { ModelState } from '../models/model'

export enum RuleMatchMode {
    Contains = 'contains',
    Exact = 'exact',
}

export type Rule = {
    id: string
    matchMode: RuleMatchMode
    name?: string
    default?: boolean
    query?: string
    projectId?: string
    labels?: Array<string>
    dueDate?: string
}

export type RulesState = ModelState<Array<Rule>>
