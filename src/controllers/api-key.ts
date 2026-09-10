import { TodoistAPIKey } from '../api/todoist'
import Projects from '../models/projects'

export function setAPIKey(value: string) {
    return Projects.delete().then(() => TodoistAPIKey.set(value))
}

export function deleteAPIKey() {
    return Projects.delete().then(() => TodoistAPIKey.remove())
}
