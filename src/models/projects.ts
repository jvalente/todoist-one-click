import Storage from '../storage/storage.js'
import API from '../api/api.js'
import Model from './model.js'

class ProjectModel extends Model<any> {
    constructor() {
        super('projects', { url: 'projects' })
    }
}

const Projects = new ProjectModel()

export default Projects
