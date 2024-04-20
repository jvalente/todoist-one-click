import { html, LitElement } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import DueDate from '../../models/due-date'
import { setDueDate } from '../../controllers/due-date'

@customElement('tc-due-date')
export class DueDateElement extends LitElement {
    static styles = [settingsSection]

    @state()
    value = ''

    @query('#dueDate')
    dueDateInput?: HTMLInputElement

    connectedCallback() {
        super.connectedCallback()

        DueDate.attach(this.onDueDateUpdate)
        DueDate.hydrate()
    }

    private handleKeyUp(event: InputEvent) {
        event.preventDefault()

        // TODO: find type solution
        if (this.dueDateInput && (event as any).key === 'Enter') {
            setDueDate(this.dueDateInput.value)
            this.dueDateInput.value = ''
        }
    }

    private onDueDateUpdate = ({ data }: any) => {
        this.value = data || ''
    }

    render() {
        return html`<section>
            <label>Due date</label>
            ${this.value
                ? renderDueDate(this.value)
                : renderNoDueDatePlaceholder()}
            <input
                id="dueDate"
                placeholder=${getInputPlaceholder(this.value)}
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

function getInputPlaceholder(value: string) {
    return `Type and press Enter to ${
        value ? 'change/delete the' : 'set a'
    } due date...`
}
