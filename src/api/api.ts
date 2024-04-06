import APIKey from './api-key'

const API_URL = 'https://api.todoist.com/rest'
const API_VERSION = 'v2'

function fetchTodoistApi<T>(
    path: string,
    { method, body }: any = { method: 'GET', body: undefined }
): Promise<T> {
    // TODO move into API
    chrome.action.setIcon({
        path: {
            '48': 'icons/loading.png',
            '96': 'icons/loading@2x.png',
        },
    })

    return APIKey.get().then((apiKey) => {
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
                return response.json().then((data) => {
                    chrome.action.setIcon({
                        path: {
                            '48': 'icons/success.png',
                            '96': 'icons/success@2x.png',
                        },
                    })

                    setTimeout(() => {
                        chrome.action.setIcon({
                            path: {
                                '48': 'icons/icon.png',
                                '96': 'icons/icon@2x.png',
                            },
                        })
                    }, 2000)

                    return data
                })
            })
            .catch((error) => {
                // TODO introduce an error icon
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

const API = { fetchTodoistApi }

export default API
