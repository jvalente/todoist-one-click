import Model, { ModelState } from './model'

type Project = {
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

export type ProjectState = ModelState<Project[]>

class ProjectModel extends Model<Project> {
    constructor() {
        super('projects', { url: 'projects' })
    }
}

const Projects = new ProjectModel()

export default Projects
