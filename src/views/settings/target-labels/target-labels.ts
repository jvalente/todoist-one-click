import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { updateDefaultRule } from '../../../controllers/rules'

import type { InputChangeEvent } from '../../common/system'

import '../../common/system'
import './target-labels-list'

@customElement('tc-target-labels')
class TargetLabelsElement extends LitElement {
    @property({ type: Array })
    labels?: Array<string>

    @state()
    private value = ''

    private handleInputChange(event: InputChangeEvent) {
        this.value = (event.value || '').trim()
    }

    private handleInputEnterPress() {
        updateDefaultRule({ labels: [...(this.labels || []), this.value] })
        this.value = ''
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
        return html`<tc-text-input
            placeholder="Type and press Enter to add a label..."
            @change=${this.handleInputChange}
            @enterPress=${this.handleInputEnterPress}
            .value=${this.value}
            ?disableSpace=${true}
        />`
    }

    render() {
        return html`<tc-section title="Target labels">
            ${this.renderTargetLabelsList()}${this.renderTargeLabelsInput()}
        </tc-section>`
    }
}
