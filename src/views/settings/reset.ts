import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { deleteAPIKey } from '../../controllers/api-key'
import { clearAllData } from '../../controllers/data'
import { addTask } from '../../controllers/task'

@customElement('tc-reset')
class ApiKeyElement extends LitElement {
    private addTestTask() {
        addTask('Todoist One-Click test task', 'https://doist.com')
    }

    render() {
        return html`<tc-section title="Local data management & troubleshooting">
            <div>
                <tc-link @click=${deleteAPIKey}>Update API Token</tc-link>
            </div>
            <div>
                <tc-text small secondary>
                    Clear the extension's data from your browser, including the
                    API token, target project, and labels. This won't affect
                    your Todoist account data.
                </tc-text>
                <tc-link @click=${clearAllData}>Clear all local data</tc-link>
            </div>
            <div>
                <tc-text small secondary
                    >Add a test task to test your setup.</tc-text
                >
                <tc-link @click=${this.addTestTask}>Add test task</tc-link>
            </div>
        </tc-section>`
    }
}
