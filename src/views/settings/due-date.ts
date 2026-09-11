import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { updateDefaultRule } from '../../controllers/rules'
import type { DueDateChangeEvent } from '../common/system'

import '../common/system'

@customElement('tc-due-date')
export class DueDateElement extends LitElement {
    @property()
    dueDate?: string

    render() {
        return html`<tc-section
            title="Due date"
            description="Choose when new tasks are due by default."
        >
            <tc-due-date-control
                .dueDate=${this.dueDate || ''}
                @change=${this.handleDueDateChange}
            ></tc-due-date-control>
        </tc-section>`
    }

    private handleDueDateChange(event: DueDateChangeEvent) {
        updateDefaultRule({ dueDate: event.dueDate })
    }
}
