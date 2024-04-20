import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import './reset'
import { settingsSection } from '../common/styles/section'
import { getErrorDescription } from '../common/error-details'

@customElement('tc-settings-error')
export class SettingsErrorElement extends LitElement {
    static styles = [settingsSection]

    @property()
    error: any = undefined

    render() {
        if (this.error) {
            return html`<section>
                <label>Something went wrong...</label>
                <small>${getErrorDescription(this.error)}</small>
                <small style="font-family: monospace;font-style: italic;"
                    >${this.error?.message}</small
                >
                <tc-al @click=${() => window.location.reload()}>Retry</tc-al>
            </section>`
        }
    }
}
