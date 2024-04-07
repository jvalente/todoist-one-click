import Model from './model'

class ProjectModel extends Model<any> {
    constructor() {
        super('projects', { url: 'projects' })
    }
}

const Projects = new ProjectModel()

export default Projects
