import { html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { settingsSection } from '../../common/styles/section'

import './target-labels-list'
import { updateDefaultRule } from '../../../controllers/rules'

@customElement('tc-target-labels')
export class TargetLabelsElement extends LitElement {
    static styles = [settingsSection]

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
            return html`<small>No target labels added yet.</small>`
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
        return html`<section>
            <label>Target labels</label>
            ${this.renderTargetLabelsList()}${this.renderTargeLabelsInput()}
        </section>`
    }
}
