import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { deleteAPIKey } from '../../controllers/api-key'
import { clearAllData } from '../../controllers/data'
import { addTask } from '../../controllers/task'

@customElement('tc-reset')
export class ResetElement extends LitElement {
    static styles = css`
        .items {
            display: grid;
        }

        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 20px 0;
        }

        .item:first-child {
            padding-top: 0;
        }

        .item + .item {
            border-top: 1px solid var(--section-border-color);
        }

        .copy {
            min-width: 0;
        }

        h3,
        p {
            margin: 0;
        }

        h3 {
            font-size: 0.875rem;
            font-weight: 600;
        }

        p {
            margin-top: 4px;
            color: var(--secondary-color);
            font-size: 0.75rem;
            line-height: 1.65;
        }

        tc-button {
            flex-shrink: 0;
        }
    `

    private addTestTask() {
        addTask('Todoist One-Click test task', 'https://doist.com')
    }

    render() {
        return html`<tc-section
            title="Data & troubleshooting"
            description="Manage this extension's data and test your Todoist connection."
        >
            <div class="items">
                <div class="item">
                    <div class="copy">
                        <h3>API token</h3>
                        <p>Replace your Todoist API token.</p>
                    </div>
                    <tc-button text @click=${deleteAPIKey}
                        >Update token</tc-button
                    >
                </div>
                <div class="item">
                    <div class="copy">
                        <h3>Local data</h3>
                        <p>
                            Clear the API token, project, labels, and other
                            extension data. This does not affect Todoist.
                        </p>
                    </div>
                    <tc-button secondary @click=${clearAllData}
                        >Clear local data</tc-button
                    >
                </div>
                <div class="item">
                    <div class="copy">
                        <h3>Test connection</h3>
                        <p>Add a test task to confirm your setup works.</p>
                    </div>
                    <tc-button text @click=${this.addTestTask}
                        >Add test task</tc-button
                    >
                </div>
            </div>
        </tc-section>`
    }
}
