import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { errorCard } from '../../common/styles/error-card'
import { getErrorDescription } from '../../common/error-details'
import {
    discardFailedTask,
    retryFailedTask,
} from '../../../controllers/failed-tasks'

@customElement('tc-failed-task-item')
export class FailedTaskItemElement extends LitElement {
    static styles = [errorCard]

    @property()
    failedTask?: any

    private handleDiscard() {
        discardFailedTask(this.failedTask.id)
    }

    private handleRetry() {
        retryFailedTask(this.failedTask)
    }

    render() {
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
