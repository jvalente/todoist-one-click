import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { updateDefaultRule } from '../../controllers/rules'
import type { InputChangeEvent } from '../common/system'

import '../common/system'

@customElement('tc-due-date')
export class DueDateElement extends LitElement {
    @property()
    dueDate?: string

    @state()
    private value = ''

    private handleInputChange(event: InputChangeEvent) {
        this.value = event.value
    }

    private handleInputEnterPress() {
        updateDefaultRule({ dueDate: this.value })
        this.value = ''
    }

    render() {
        return html`<tc-section title="Due date">
            ${
                this.dueDate
                    ? renderDueDate(this.dueDate)
                    : renderNoDueDatePlaceholder()
            }
            <tc-text-input
                placeholder=${getInputPlaceholder(this.dueDate)}
                @change=${this.handleInputChange}
                @enterPress=${this.handleInputEnterPress}
                .value=${this.value}
            /></tc-text-input>
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
