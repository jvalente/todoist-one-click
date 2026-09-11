import { css, html, LitElement, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { DueDateChangeEvent } from './events'
import type { InputChangeEvent, SwitchChangeEvent } from './events'

import './tc-button'
import './tc-link'
import './tc-switch'
import './tc-text-input'

@customElement('tc-due-date-control')
export class DueDateControlElement extends LitElement {
    static styles = css`
        tc-switch:not(:last-child) {
            margin-bottom: 24px;
        }

        [role='status'] {
            overflow-wrap: anywhere;
        }

        strong {
            color: var(--primary-color);
            font-weight: 500;
        }
    `

    @property()
    dueDate = ''

    @state()
    private value = ''

    private lastDate = 'today'

    willUpdate(changed: PropertyValues<this>) {
        if (!changed.has('dueDate')) return

        this.value = this.dueDate
        if (this.dueDate) this.lastDate = this.dueDate
    }

    render() {
        return html`<tc-switch
                name="toggle-due-date"
                .checked=${Boolean(this.dueDate)}
                @change=${this.handleToggle}
            >
                Add a due date
                <span slot="help" role="status"
                    >${this.dueDate ? `Currently: ${this.dueDate}` : 'No due date'}</span
                >
            </tc-switch>
            ${this.renderDateInput()}`
    }

    private renderDateInput() {
        if (!this.dueDate) return nothing

        return html`<tc-text-input
            label="Due date"
            placeholder="e.g. tomorrow"
            .value=${this.value}
            @change=${this.handleInputChange}
            @enterPress=${this.handleSaveDate}
        >
            <tc-link
                external
                small
                slot="action"
                href="https://todoist.com/help/articles/introduction-to-due-dates-and-due-times"
                >Date formats</tc-link
            >
            <tc-button
                secondary
                slot="trailing"
                ?disabled=${!this.value.trim() || this.value.trim() === this.dueDate}
                @click=${this.handleSaveDate}
                >Save date</tc-button
            >
            <span slot="help">
                Use English, e.g. <strong>tomorrow</strong> or
                <strong>next week</strong>. Relative dates apply when you add a task.
            </span>
        </tc-text-input>`
    }

    private handleToggle(event: SwitchChangeEvent) {
        this.dispatchEvent(
            new DueDateChangeEvent(event.checked ? this.lastDate : ''),
        )
    }

    private handleInputChange(event: InputChangeEvent) {
        this.value = event.value
    }

    private handleSaveDate() {
        const dueDate = this.value.trim()
        if (!dueDate || dueDate === this.dueDate) return

        this.dispatchEvent(new DueDateChangeEvent(dueDate))
    }
}
