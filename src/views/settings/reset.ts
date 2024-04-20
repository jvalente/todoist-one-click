import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import { deleteAPIKey } from '../../controllers/api-key'
import { clearAllData } from '../../controllers/data'

@customElement('tc-reset')
export class ApiKeyElement extends LitElement {
    static styles = [settingsSection]

    render() {
        return html`<section>
            <label>Local data management & troubleshooting</label>
            <div>
                <tc-al @click=${deleteAPIKey}>Update API Token</tc-al>
            </div>
            <div>
                <small
                    >Clear the extension's data from your browser, including the
                    API token, target project, and labels. This won't affect
                    your Todoist account data.
                </small>
                <tc-al @click=${clearAllData}>Clear all local data</tc-al>
            </div>
        </section>`
    }
}
