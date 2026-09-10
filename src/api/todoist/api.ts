import { TodoistAPIKey } from './api-key'

const API_URL = 'https://api.todoist.com/api'
const API_VERSION = 'v1'

type RequestOptions = {
    method?: 'GET' | 'POST'
    body?: Record<string, unknown>
    params?: Record<string, string>
}

const unauthorizedObservers = new Set<() => Promise<void>>()

function request<T>(
    path: string,
    { method = 'GET', body, params }: RequestOptions = {},
): Promise<T> {
    return TodoistAPIKey.get().then((apiKey) => {
        if (!apiKey) {
            throw new Error('API key not found')
        }

        return fetch(getURL(path, params), {
            method,
            headers: getHeaders(apiKey),
            ...(method === 'POST' && body
                ? { body: JSON.stringify(body) }
                : {}),
        })
            .then((response) => {
                if (!response.ok) {
                    const { status } = response

                    return response.text().then((text) => {
                        throw { text, status }
                    })
                }
                return response.json().then((data) => data)
            })
            .catch((error) => {
                const apiError = new TodoistAPIError(error)

                if (apiError.status === 401) {
                    return clearUnauthorizedData().then(() => {
                        return TodoistAPIKey.remove().then(() => {
                            throw apiError
                        })
                    })
                }

                throw apiError
            })
    })
}

function attachUnauthorized(observer: () => Promise<void>) {
    unauthorizedObservers.add(observer)

    return () => unauthorizedObservers.delete(observer)
}

function clearUnauthorizedData() {
    return Promise.all([...unauthorizedObservers].map((observer) => observer()))
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
function getURL(path: string, params?: RequestOptions['params']) {
    const query = params ? `?${new URLSearchParams(params)}` : ''

    return `${API_URL}/${API_VERSION}/${path}${query}`
}

/**
 *
 */
class TodoistAPIError extends Error {
    readonly status?: number
    readonly online?: boolean
    readonly responseText?: string

    constructor(error: unknown) {
        if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            'text' in error
        ) {
            super(`Bad response (${error.status})`)
            this.status = error.status as number
            this.responseText = error.text as string
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
            responseText: this.responseText,
            status: this.status,
            online: this.online,
        }
    }
}

export const TodoistAPI = { request, attachUnauthorized }
export { TodoistAPIError }
