import { html } from 'lit'

export function getErrorDescription(error: any) {
    if (error && error.status === 401) {
        return html`<small
            >This error usually happens when the API token is invalid or
            expired. Try to update it using the option below.</small
        >`
    }

    if (
        error &&
        (error.message?.toLowerCase() === 'failed to fetch' ||
            error.message?.toLowerCase() ===
                'networkerror when attempting to fetch resource.')
    ) {
        return html`<small
            >Looks like there's an issue connecting to Todoist. Is your internet
            working alright?</small
        >`
    }

    return html`<small>Unknown error</small>`
}
