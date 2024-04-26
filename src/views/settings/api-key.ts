import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { setAPIKey } from '../../controllers/api-key'

import type { InputChangeEvent } from '../common/system'

import '../common/system'

@customElement('tc-api-key')
class ApiKeyElement extends LitElement {
    @state()
    private apiKey?: string

    private handleOnClick() {
        if (this.apiKey) setAPIKey(this.apiKey)
    }

    render() {
        return html`<tc-section title="Enter your API token">
            <tc-text>
                Get started with Todoist One-Click by grabbing your API token
                from Todoist
                <tc-link
                    href="https://app.todoist.com/app/settings/integrations/developer"
                    >'Settings > Integrations > Developer'</tc-link
                >.
            </tc-text>
            <tc-text
                >Without it, the extension won't be able to add tasks to your
                Todoist account.</tc-text
            >
            <tc-text-input
                placeholder="Paste the API token here..."
                @change=${(event: InputChangeEvent) => {
                    this.apiKey = event.value
                }}
                ?autofocus=${true}
                ?disableSpace=${true}
            ></tc-text-input>
            <button @click=${this.handleOnClick}>Save</button>
        </tc-section>`
    }
}
