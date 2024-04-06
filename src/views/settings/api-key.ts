import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import { setAPIKey } from '../../controllers/api-key'

@customElement('tc-api-key')
export class ApiKeyElement extends LitElement {
    static styles = [settingsSection]

    @query('#apiKey')
    apiKeyInput?: HTMLInputElement

    private handleOnClick(event: KeyboardEvent) {
        const inputValue = this.apiKeyInput?.value

        if (inputValue) {
            setAPIKey(inputValue)
        }
    }

    render() {
        return html`<section>
                <p>
                    Get started with Todoist One-Click by grabbing your API key
                    from Todoist <a href="https://app.todoist.com/app/settings/integrations/developer" target="_blank">'Settings > Integrations > Developer'</a>. It's the
                    key to connecting the extension with your Todoist!</p>
                    <input
                        autofocus
                        placeholder="Paste the API key here..."
                        id="apiKey"
                        type="text"
                    />
                    <button @click=${this.handleOnClick}>Save</button>
                </p>
            </section>`
    }
}
