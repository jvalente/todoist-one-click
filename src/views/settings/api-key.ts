import { css, html, LitElement } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { setAPIKey } from '../../controllers/api-key'

@customElement('tc-api-key')
export class ApiKeyElement extends LitElement {
    @query('#apiKey')
    apiKeyInput?: HTMLInputElement

    private handleOnClick(event: KeyboardEvent) {
        const inputValue = this.apiKeyInput?.value

        if (inputValue) {
            setAPIKey(inputValue)
        }
    }

    render() {
        return html`<tc-section title="Enter your API token">
                <p> 
                    Get started with Todoist One-Click by grabbing your API token
                    from Todoist <tc-link href="https://app.todoist.com/app/settings/integrations/developer">'Settings > Integrations > Developer'</tc-link>.
                </p>
                <p>Without it, the extension won't be able to add tasks to your Todoist account.</p>
                <input
                    autofocus
                    placeholder="Paste the API token here..."
                    id="apiKey"
                    type="text"
                />
                <button @click=${this.handleOnClick}>Save</button>
                </p>
            </tc-section>`
    }
}
