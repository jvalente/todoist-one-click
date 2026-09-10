import { TodoistAPI } from '../api/todoist'
import Model from './model'
import type {
    Project,
    ProjectsData,
    ProjectsPage,
} from '../types/projects.types'

class ProjectModel extends Model<ProjectsData> {
    constructor() {
        super('projects')
    }

    protected hydrateFromAPI() {
        return this.getAll()
    }

    getAllNames() {
        return this.get().then((projects) =>
            projects?.results?.map((project) => project.name),
        )
    }

    getByName(projectName: string) {
        return this.get().then((projects) =>
            projects?.results?.find((project) => project.name === projectName),
        )
    }

    private getAll(
        cursor?: string,
        projects: Project[] = [],
    ): Promise<ProjectsData> {
        return TodoistAPI.request<ProjectsPage>('projects', {
            params: { limit: '200', ...(cursor ? { cursor } : {}) },
        }).then(({ results, next_cursor }) => {
            projects.push(...results)

            return next_cursor
                ? this.getAll(next_cursor, projects)
                : { results: projects }
        })
    }
}

const Projects = new ProjectModel()

export default Projects
