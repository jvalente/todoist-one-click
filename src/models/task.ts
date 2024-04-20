import { TodoistAPI } from '../api/todoist'

type TaskParams = {
    title: string
    url?: string
    projectId?: string
    labels?: string[]
    dueDate?: string
}

export class Task {
    title: string
    url?: string
    projectId?: string
    labels?: string[]
    dueDate?: string

    constructor({ title, url, projectId, labels, dueDate }: TaskParams) {
        this.title = title
        this.url = url
        this.projectId = projectId
        this.labels = labels
        this.dueDate = dueDate
    }

    flush() {
        return TodoistAPI.request('tasks', {
            method: 'POST',
            body: {
                // TODO: Add validation
                content: `[${this.title}](${this.url})`,
                ...(this.projectId ? { project_id: this.projectId } : {}),
                ...(this.labels ? { labels: this.labels } : {}),
                ...(this.dueDate ? { due_string: this.dueDate } : {}),
            },
        })
    }
}
