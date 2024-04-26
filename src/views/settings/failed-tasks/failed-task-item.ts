import { html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { errorCard } from '../../common/styles/error-card'

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
        if (!this.failedTask) return nothing

        return html`<tc-error-card
            title="${this.failedTask.task.title}"
            .error=${this.failedTask.error}
        >
            <tc-link small slot="actions" @click=${this.handleRetry}
                >Retry</tc-link
            >
            <tc-link small slot="actions" @click=${this.handleDiscard}
                >Discard</tc-link
            >
        </tc-error-card>`
    }
}
