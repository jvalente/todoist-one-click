import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { settingsSection } from './styles/section'
import Storage from '../../storage/storage.js'
import { deleteAPIKey } from '../../controllers/api-key'
import { clearAllData } from '../../controllers/data'

@customElement('tc-reset')
export class ApiKeyElement extends LitElement {
    static styles = [settingsSection]

    private handleReset(event: KeyboardEvent) {
        event.preventDefault()
        Storage.reset()
            .then(() => window.location.reload())
            .catch((error) => console.log(error))
    }

    render() {
        return html`<section>
            <label>Local data management & troubleshooting</label>
            <div>
                <a href="#" @click=${deleteAPIKey}>Update API Token</a>
            </div>
            <div>
                <small
                    >Clear the extension's data from your browser, including the
                    API token, target project, and labels. This won't affect
                    your Todoist account data.
                </small>
                <a href="#" @click=${clearAllData}>Clear all local data</a>
            </div>
        </section>`
    }
}
