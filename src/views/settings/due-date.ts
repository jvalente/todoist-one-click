import { html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { updateDefaultRule } from '../../controllers/rules'

@customElement('tc-due-date')
export class DueDateElement extends LitElement {
    @property()
    dueDate?: string

    @query('#dueDate')
    dueDateInput?: HTMLInputElement

    private handleKeyUp(event: InputEvent) {
        event.preventDefault()

        // TODO: find type solution
        if (this.dueDateInput && (event as any).key === 'Enter') {
            updateDefaultRule({ dueDate: this.dueDateInput.value })
            this.dueDateInput.value = ''
        }
    }

    render() {
        return html`<tc-section title="Due date">
            ${this.dueDate
                ? renderDueDate(this.dueDate)
                : renderNoDueDatePlaceholder()}
            <input
                id="dueDate"
                placeholder=${getInputPlaceholder(this.dueDate)}
                @keyup=${this.handleKeyUp}
                type="text"
            />
        </tc-section>`
    }
}

function renderDueDate(dueDate: string) {
    return html`<tc-text
        >Your tasks will have a <code>${dueDate}</code> due date.</tc-text
    >`
}

function renderNoDueDatePlaceholder() {
    return html`<tc-text small secondary
        >The tasks you add will have no due date. A due date can be set
        according to the
        <tc-link
            href="https://todoist.com/help/articles/introduction-to-due-dates-and-due-times"
            >Todoist natural language format</tc-link
        >, in English. For example: <i>today, tomorrow, next week.</i></tc-text
    >`
}

function getInputPlaceholder(value?: string) {
    return `Type and press Enter to ${
        value ? 'change/delete the' : 'set a'
    } due date...`
}
