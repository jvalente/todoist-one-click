import { html, LitElement } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import TargetLabels from '../../models/target-labels'
import { removeLabel, setLabels } from '../../controllers/labels'

import './target-labels-list'

@customElement('tc-target-labels')
export class TargetLabelsElement extends LitElement {
    static styles = [settingsSection]

    @state()
    targetLabels: Array<string> = []

    @state()
    value = ''

    @query('#targetLabel')
    targetLabelInput?: HTMLInputElement

    connectedCallback() {
        super.connectedCallback()

        TargetLabels.attach(this.onTargetLabelsUpdate)
        TargetLabels.hydrate()
    }

    private onTargetLabelsUpdate = ({ data }: any) => {
        this.targetLabels = data || []
    }

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
            setLabels(this.targetLabels, this.value)
            this.value = ''
        }
    }

    private handleRemoveLabel(label: string) {
        removeLabel(this.targetLabels, label)
    }

    private renderTargetLabelsList() {
        if (!this.targetLabels.length) {
            return html`<small>No target labels added yet.</small>`
        }

        return html` <tc-target-labels-list
            .labels=${this.targetLabels}
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
