import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { settingsSection } from '../../common/styles/section'
import FailedTasks from '../../../models/failed-tasks'
import { repeat } from 'lit/directives/repeat.js'

import './failed-task-item'

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
        if (!this.failedTasks || !this.failedTasks.length) return null

        return html`<section>
            <label>Failed tasks (${this.failedTasks.length})</label>

            <small>The following tasks could not be added to Todoist:</small>

            <ul>
                ${repeat(
                    this.failedTasks,
                    (failedTask) => failedTask.id,
                    (failedTask: any) =>
                        html`<li>
                            <tc-failed-task-item
                                .failedTask=${failedTask}
                            ></tc-failed-task-item>
                        </li>`
                )}
            </ul>
        </section>`
    }
}
