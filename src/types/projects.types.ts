import type { ModelState } from '../models/model'

export type Project = {
    id: string
    parent_id: string
    order: number
    color: string
    name: string
    comment_count: number
    is_shared: boolean
    is_favorite: boolean
    is_inbox_project: boolean
    is_team_inbox: boolean
    url: string
    view_style: string
}

export type ProjectsState = ModelState<Project[]>
