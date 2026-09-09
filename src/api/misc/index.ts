import { Manifest } from '../extension'

const API_URL = 'https://tdoneclick.pereiravalente.com'
const LLM_TIMEOUT = 20000

function guessProject(projects: string[], title: string, url: string) {
    const params = new URLSearchParams({
        projects: JSON.stringify(projects),
        title,
        url,
    })
    const urlWithParams = `${API_URL}/guess_project?${params}`

    const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(
            () => reject('Service did not respond in time'),
            LLM_TIMEOUT,
        ),
    )

    return Promise.race([fetch(urlWithParams), timeoutPromise])
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok - ${response.statusText}`,
                )
            }
            return response.json()
        })
        .then((data: [string]) => {
            if (Array.isArray(data) && data.length > 0 && data[0] !== '') {
                return data[0]
            }
            return undefined
        })
        .catch(() => undefined)
}

function registerEvent(guessProjectEnabled: boolean, userId: string) {
    const url = `${API_URL}/register_event`
    const version = Manifest.getVersion()
    const lang = navigator?.language || 'unknown'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version, lang, guessProjectEnabled, userId }),
    })
}

export const llmAPI = { guessProject }
export const analyticsAPI = { registerEvent }
