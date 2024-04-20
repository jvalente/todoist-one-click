import { TodoistAPIKey } from './api-key'

const API_URL = 'https://api.todoist.com/rest'
const API_VERSION = 'v2'

function request<T>(
    path: string,
    { method, body }: any = { method: 'GET', body: undefined }
): Promise<T> {
    return TodoistAPIKey.get().then((apiKey) => {
        if (!apiKey) {
            throw new Error('API key not found')
        }

        return fetch(getURL(path), {
            method,
            headers: getHeaders(apiKey),
            ...(method === 'POST' && body
                ? { body: JSON.stringify(body || '') }
                : {}),
        })
            .then((response) => {
                if (!response.ok) throw response
                return response.json().then((data) => data)
            })
            .catch((error) => {
                throw new TodoistApiError(error)
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
class TodoistApiError extends Error {
    readonly status?: number

    constructor(error: unknown) {
        if (error instanceof Response) {
            super(`Bad response (${error.status})`)
            this.status = error.status
        } else {
            super(error instanceof Error ? error?.message : 'Unknown error')
        }

        this.name = 'TodoistApiError'
    }
}

export const TodoistAPI = { request }
