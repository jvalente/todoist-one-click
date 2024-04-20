import { TodoistAPIKey } from '../api/todoist'

export function setAPIKey(value: string) {
    return TodoistAPIKey.set(value)
}

export function deleteAPIKey() {
    return TodoistAPIKey.remove()
}
