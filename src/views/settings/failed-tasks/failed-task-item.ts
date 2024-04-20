import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { errorCard } from '../../common/styles/error-card'
import { getErrorDescription } from '../../common/error-details'

@customElement('tc-failed-task-item')
export class FailedTaskItemElement extends LitElement {
    static styles = [errorCard]

    @property()
    failedTask?: any

    render() {
        return html`<div>
            <header>${this.failedTask.task.title}</header>
            <div>${getErrorDescription(this.failedTask.error)}</div>
            <footer>
                <small><tc-al @click=${() => {}}>Retry</tc-al></small>
                <small><tc-al @click=${() => {}}>Discard</tc-al></small>
            </footer>
        </div>`
    }
}
