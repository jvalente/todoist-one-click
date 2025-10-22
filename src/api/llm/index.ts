const LLM_URL = 'https://tdoneclick.pythonanywhere.com/guess_project'
const LLM_TIMEOUT = 20000

function guessProject(projects: string[], title: string, url: string) {
    const urlWithParams = `${LLM_URL}?projects=${encodeURIComponent(
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

export const llmAPI = { guessProject }
