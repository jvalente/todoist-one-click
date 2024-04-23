import type { ModelState } from '../models/model'

export type Rule = {
    id: string
    default: boolean
    query?: string
    matchMode: 'exact' | 'contains'
    projectId?: string
    labels?: Array<string>
    dueDate?: string
}

export type RulesState = ModelState<Array<Rule>>
