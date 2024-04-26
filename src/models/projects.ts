import Model from './model'

import type { Project } from '../types/projects.types'
class ProjectModel extends Model<Array<Project>> {
    constructor() {
        super('projects', { fetchResource: { url: 'projects' } })
    }
}

const Projects = new ProjectModel()

export default Projects
