import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import './reset'

@customElement('tc-settings-error')
export class SettingsErrorElement extends LitElement {
    // TODO: caution, the error gets passed down as TodoistAPIError but here it becomes a plain object
    // since it is passed as an element attribute, it gets serialized and deserialized
    @property({ type: Object })
    error: any = undefined

    render() {
        if (this.error) {
            return html`<tc-section title="Something went wrong...">
                <small style="font-family: monospace;font-style: italic;"
                    >${this.error?.message}</small
                >
                <tc-al @click=${() => window.location.reload()}>Retry</tc-al>
            </tc-section>`
        }
    }
}
