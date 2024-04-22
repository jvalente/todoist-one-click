import { TodoistAPIKey } from './api-key'

const API_URL = 'https://api.todoist.com/rest'
const API_VERSION = 'v2'

type RequestOptions = {
    method: 'GET' | 'POST'
    body: Record<string, unknown> | undefined
}

function request<T>(
    path: string,
    { method, body }: RequestOptions = { method: 'GET', body: undefined }
): Promise<T> {
    return TodoistAPIKey.get().then((apiKey) => {
        if (!apiKey) {
            throw new Error('API key not found')
        }

        return fetch(getURL(path), {
            method,
            headers: getHeaders(apiKey),
            ...(method === 'POST' && body
                ? { body: JSON.stringify(body) }
                : {}),
        })
            .then((response) => {
                if (!response.ok) throw response
                return response.json().then((data) => data)
            })
            .catch((error) => {
                throw new TodoistAPIError(error)
            })
    })
}

/**
 *
 */
function getHeaders(apiKey: string) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
    }
}

/**
 *
 */
function getURL(path: string) {
    return `${API_URL}/${API_VERSION}/${path}`
}

/**
 *
 */
class TodoistAPIError extends Error {
    readonly status?: number
    readonly online?: boolean

    constructor(error: unknown) {
        if (error instanceof Response) {
            super(`Bad response (${error.status})`)
            this.status = error.status
        } else {
            super(error instanceof Error ? error?.message : 'Unknown error', {
                cause: error,
            })
        }

        this.online = navigator.onLine
        this.name = 'TodoistAPIError'
    }

    serialize() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            online: this.online,
        }
    }
}

export const TodoistAPI = { request }
export { TodoistAPIError }
