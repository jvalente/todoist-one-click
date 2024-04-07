import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import './reset'
import { settingsSection } from '../common/styles/section'

@customElement('tc-settings-error')
export class SettingsErrorElement extends LitElement {
    static styles = [settingsSection]

    @property()
    error: any = undefined

    private getErrorDescription(error: any) {
        if (error && error.status === 401) {
            return html`<small
                >This error usually happens when the API token is invalid or
                expired. Try to update it using the option below.</small
            >`
        }

        if (
            error &&
            (error.message.toLowerCase() === 'failed to fetch' ||
                error.message.toLowerCase() ===
                    'networkerror when attempting to fetch resource.')
        ) {
            return html`<small
                >Looks like there's an issue connecting to Todoist. Is your
                internet working alright?</small
            >`
        }

        return null
    }

    render() {
        if (this.error) {
            return html`<section>
                <label>Something went wrong...</label>
                ${this.getErrorDescription(this.error)}
                <small style="font-family: monospace;font-style: italic;"
                    >${this.error?.message}</small
                >
                <a href="#" @click=${() => window.location.reload()}>Retry</a>
            </section>`
        }
    }
}
