import Model from './model'
import type { Project } from '../types/projects.types'

class ProjectModel extends Model<Array<Project>> {
    constructor() {
        super('projects', { fetchResource: { url: 'projects' } })
    }

    getAllNames() {
        return this.get().then((projects) =>
            projects?.map((project) => project.name),
        )
    }

    getByName(projectName: string) {
        return this.get().then((projects) =>
            projects?.find((project) => project.name === projectName),
        )
    }
}

const Projects = new ProjectModel()

export default Projects
