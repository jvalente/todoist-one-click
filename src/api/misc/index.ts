import { Manifest } from "../extension"

const LAMBDA_URL = 'https://6izom2n40j.execute-api.us-east-1.amazonaws.com/production'
const LLM_TIMEOUT = 20000

function guessProject(projects: string[], title: string, url: string) {
    const urlWithParams = `${LAMBDA_URL}/guess_project?projects=${encodeURIComponent(
        JSON.stringify(projects),
    )}&title=${title}&url=${url}`

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

function registerEvent() {
    const url = `${LAMBDA_URL}/register_event`
    const version = Manifest.getVersion()
    const lang = navigator?.language || 'unknown'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version, lang }),
    })
}

export const llmAPI = { guessProject }
export const analyticsAPI = { registerEvent }
