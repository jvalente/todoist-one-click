import { html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { settingsSection } from '../common/styles/section'
import TargetLabels from '../../models/target-labels'
import { removeLabel, setLabels } from '../../controllers/labels'

import './target-labels-list'

@customElement('tc-target-labels')
export class TargetLabelsElement extends LitElement {
    static styles = [settingsSection]

    @property({ type: Array })
    targetLabels: Array<string> = []

    @query('#targetLabel')
    targetLabelInput?: HTMLInputElement

    @property()
    value = ''

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

        // TODO: find type solution
        this.value = ((event?.target as HTMLInputElement)?.value || '').trim()
        ;(event?.target as HTMLInputElement).value = this.value
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
            <label>Target Labels</label>
            ${this.renderTargetLabelsList()}${this.renderTargeLabelsInput()}
        </section>`
    }
}
