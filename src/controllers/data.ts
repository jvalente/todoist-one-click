import Projects from '../models/projects'
import TargetProjectId from '../models/target-project-id'
import { deleteAPIKey } from './api-key'
import { Storage } from '../api/extension'

export function clearAllData() {
    deleteAPIKey()

    Projects.delete()
    TargetProjectId.delete()

    Storage.reset()
}
