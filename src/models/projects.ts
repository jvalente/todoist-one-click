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

// type Project = {
//     id: string
//     parent_id: string | null
//     order: number
//     color: string
//     name: string
//     comment_count: number
//     is_shared: boolean
//     is_favorite: boolean
//     is_inbox_project: boolean
//     is_team_inbox: boolean
//     url: string
//     view_style: string
// }

// type Projects = Project[]

// function get(apiKey?: string) {
//     return Storage.get<Projects>('projects').then((projects) => {
//         if (projects === undefined) {
//             if (apiKey === undefined) {
//                 throw new Error('No API key found')
//             } else {
//                 return API.getProjects<Projects>(apiKey)
//                     .then((projects) => {
//                         set(projects)
//                         return projects
//                     })
//                     .catch((error) => {
//                         throw error
//                     })
//             }
//         } else {
//             return projects
//         }
//     })
// }

// function set(projects: Projects) {
//     return Storage.set('projects', projects)
// }

// function addChangeListener(callback: (projects: Projects) => void) {
//     chrome.storage.local.onChanged.addListener((changes) => {
//         if (changes.projects) {
//             callback(changes.projects.newValue)
//         }
//     })
// }

// const Projects = {
//     get,
//     set,
//     addChangeListener,
// }

// export default Projects
