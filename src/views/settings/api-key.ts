import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { setAPIKey } from '../../controllers/api-key'
import type { InputChangeEvent } from '../common/system'

import '../common/system'

@customElement('tc-api-key')
export class ApiKeyElement extends LitElement {
    @state()
    private apiKey?: string

    private handleOnClick() {
        if (this.apiKey) setAPIKey(this.apiKey)
    }

    render() {
        return html`<tc-section title="Connect Todoist">
            <tc-text-input
                label="API token"
                type="password"
                placeholder="Paste your API token"
                @change=${(event: InputChangeEvent) => {
                    this.apiKey = event.value
                }}
                @enterPress=${this.handleOnClick}
                ?autofocus=${true}
                ?disableSpace=${true}
            >
                <tc-link
                    small
                    slot="action"
                    href="https://app.todoist.com/app/settings/integrations/developer"
                    >Find your token</tc-link
                >
                <span slot="help">
                    In Todoist, go to Settings → Integrations → Developer and
                    copy your API token.
                </span>
            </tc-text-input>
            <tc-button @click=${this.handleOnClick}>Save</tc-button>
        </tc-section>`
    }
}
