import { Project } from '../types/projects.types'
import Model from './model'
class ProjectModel extends Model<Array<Project>> {
    constructor() {
        super('projects', { fetchResource: { url: 'projects' } })
    }
}

const Projects = new ProjectModel()

export default Projects
