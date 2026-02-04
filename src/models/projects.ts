import Model from './model'
import type { Project } from '../types/projects.types'

class ProjectModel extends Model<{ results: Project[] }> {
    constructor() {
        super('projects', { fetchResource: { url: 'projects' } })
    }

    getAllNames() {
        return this.get().then((projects) =>
            projects?.results?.map((project) => project.name)
        )
    }

    getByName(projectName: string) {
        return this.get().then((projects) =>
            projects?.results?.find((project) => project.name === projectName),
        )
    }
}

const Projects = new ProjectModel()

export default Projects
