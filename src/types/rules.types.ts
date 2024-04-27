import type { ModelState } from '../models/model'

export type Rule = {
    id: string
    matchMode: 'exact' | 'contains'
    name?: string
    default?: boolean
    query?: string
    projectId?: string
    labels?: Array<string>
    dueDate?: string
}

export type RulesState = ModelState<Array<Rule>>
