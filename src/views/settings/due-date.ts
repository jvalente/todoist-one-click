import { html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import { updateDefaultRule } from '../../controllers/rules'

@customElement('tc-due-date')
export class DueDateElement extends LitElement {
    static styles = [settingsSection]

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
        return html`<section>
            <label>Due date</label>
            ${this.dueDate
                ? renderDueDate(this.dueDate)
                : renderNoDueDatePlaceholder()}
            <input
                id="dueDate"
                placeholder=${getInputPlaceholder(this.dueDate)}
                @keyup=${this.handleKeyUp}
                type="text"
            />
        </section>`
    }
}

function renderDueDate(dueDate: string) {
    return html`<p>Your tasks will have a <code>${dueDate}</code> due date.</p>`
}

function renderNoDueDatePlaceholder() {
    return html`<small
        >The tasks you add will have no due date. A due date can be set
        according to the
        <a
            href="https://todoist.com/help/articles/introduction-to-due-dates-and-due-times"
            target="_blank"
            >Todoist natural language format</a
        >, in English. For example: <i>today, tomorrow, next week.</i></small
    >`
}

function getInputPlaceholder(value?: string) {
    return `Type and press Enter to ${
        value ? 'change/delete the' : 'set a'
    } due date...`
}
