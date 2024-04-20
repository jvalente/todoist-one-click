import API from '../api/api'

type TaskParams = {
    content: string
    projectId?: string
    labels?: string[]
    dueDate?: string
}

export class Task {
    content: string
    projectId?: string
    labels?: string[]
    dueDate?: string

    constructor({ content, projectId, labels, dueDate }: TaskParams) {
        this.content = content
        this.projectId = projectId
        this.labels = labels
        this.dueDate = dueDate
    }

    flush() {
        return API.fetchTodoistApi('tasks', {
            method: 'POST',
            body: {
                content: this.content,
                ...(this.projectId ? { project_id: this.projectId } : {}),
                ...(this.labels ? { labels: this.labels } : {}),
                ...(this.dueDate ? { due_string: this.dueDate } : {}),
            },
        })
    }
}
