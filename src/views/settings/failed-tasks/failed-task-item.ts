import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { errorCard } from '../../common/styles/error-card'
import { getErrorDescription } from '../../common/error-details'
import {
    discardFailedTask,
    retryFailedTask,
} from '../../../controllers/failed-tasks'
import { FailedTask } from '../../../types/tasks.type'

@customElement('tc-failed-task-item')
export class FailedTaskItemElement extends LitElement {
    static styles = [errorCard]

    @property({ type: Object })
    failedTask?: FailedTask

    private handleDiscard() {
        discardFailedTask(this.failedTask)
    }

    private handleRetry() {
        retryFailedTask(this.failedTask)
    }

    render() {
        if (!this.failedTask) return null

        return html`<div>
            <small>${this.failedTask.task.title}</small>
            <small
                ><a href=${this.failedTask.task.url} target="_blank"
                    >${this.failedTask.task.url}</a
                ></small
            >
            <small>${getErrorDescription(this.failedTask.error)}</small>
            <footer>
                <small><tc-al @click=${this.handleRetry}>Retry</tc-al></small>
                <small>
                    <tc-al @click=${this.handleDiscard}>Discard</tc-al>
                </small>
            </footer>
        </div>`
    }
}
