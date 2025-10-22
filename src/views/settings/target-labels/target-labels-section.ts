import { html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { updateDefaultRule } from '../../../controllers/rules'

import '../../common/system'
import './target-labels-list'

@customElement('tc-target-labels-section')
class TargetLabelsSectionElement extends LitElement {
    @property({ type: Array })
    labels?: Array<string>

    private handleLabelsChange(event: CustomEvent<{ labels: Array<string> }>) {
        const { labels } = event.detail

        updateDefaultRule({ labels })
    }

    private renderTargetLabelsList() {
        return html`<tc-target-labels-list
            .labels=${this.labels}
            @change=${this.handleLabelsChange}
        ></tc-target-labels-list>`
    }

    render() {
        return html`<tc-section title="Target labels">
            ${
                !this.labels?.length
                    ? html`<tc-text small secondary
                      >No target labels added yet.</tc-text
                  >`
                    : nothing
            }
            ${this.renderTargetLabelsList()}
        </tc-section>`
    }
}
