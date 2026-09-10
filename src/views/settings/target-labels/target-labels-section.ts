import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { updateDefaultRule } from '../../../controllers/rules'

import '../../common/system'
import './target-labels-list'

@customElement('tc-target-labels-section')
export class TargetLabelsSectionElement extends LitElement {
    @property({ type: Array })
    labels?: Array<string>

    render() {
        return html`<tc-section
            title="Target labels"
            description="Choose which labels to add by default."
        >
            <tc-target-labels-list
                .labels=${this.labels}
                @change=${this.handleLabelsChange}
            ></tc-target-labels-list>
        </tc-section>`
    }

    private handleLabelsChange(event: CustomEvent<{ labels: Array<string> }>) {
        const { labels } = event.detail

        updateDefaultRule({ labels })
    }
}
