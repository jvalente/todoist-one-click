import { html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

import './target-labels-list'
import { updateDefaultRule } from '../../../controllers/rules'

@customElement('tc-target-labels')
class TargetLabelsElement extends LitElement {
    @property()
    private labels?: Array<string>

    @state()
    private value = ''

    @query('#targetLabel')
    targetLabelInput?: HTMLInputElement

    private handleInputChange(event: InputEvent) {
        event.preventDefault()

        if (this.targetLabelInput) {
            this.value = (this.targetLabelInput.value || '').trim()
            this.targetLabelInput.value = this.value
        }
    }

    // TODO: handle paste event

    private handleAddLabel(event: InputEvent) {
        event.preventDefault()

        // TODO: find type solution
        if ((event as any).key === 'Enter') {
            updateDefaultRule({ labels: [...(this.labels || []), this.value] })
            this.value = ''
        }
    }

    private handleRemoveLabel(label: string) {
        updateDefaultRule({
            labels: this.labels?.filter((l: string) => l !== label),
        })
    }

    private renderTargetLabelsList() {
        if (!this.labels?.length) {
            return html`<tc-text small secondary
                >No target labels added yet.</tc-text
            >`
        }

        return html` <tc-target-labels-list
            .labels=${this.labels}
            .onRemove=${(label: string) => this.handleRemoveLabel(label)}
        ></tc-target-labels-list>`
    }

    private renderTargeLabelsInput() {
        return html`<input
            id="targetLabel"
            placeholder="Type and press Enter to add a label..."
            @input=${this.handleInputChange}
            @keyup=${this.handleAddLabel}
            .value=${this.value}
            type="text"
        />`
    }

    render() {
        return html`<tc-section title="Target labels">
            ${this.renderTargetLabelsList()}${this.renderTargeLabelsInput()}
        </tc-section>`
    }
}
