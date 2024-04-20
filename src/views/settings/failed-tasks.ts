import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import FailedTasks from '../../models/failed-tasks'
import { repeat } from 'lit/directives/repeat.js'

@customElement('tc-failed-tasks')
export class FailedTasksElement extends LitElement {
    static styles = [settingsSection]

    @state()
    failedTasks?: any

    connectedCallback() {
        super.connectedCallback()

        FailedTasks.attach(this.onFailedTasksUpdate)
        FailedTasks.hydrate()
    }

    private onFailedTasksUpdate = ({ data }: any) => {
        this.failedTasks = data || []
    }

    render() {
        return html`<section>
                <label>Failed tasks<label />
                <ul>
            ${repeat(
                this.failedTasks,
                (failedTask: any) =>
                    html`<li><small>${failedTask?.error.name}</small></li>`
            )}
        </ul>
            </section>`
    }
}
