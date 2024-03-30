import TargetProjectId from '../models/target-project-id'

export function setTargetProjectId(projectId: string) {
    TargetProjectId.set(projectId)
}
