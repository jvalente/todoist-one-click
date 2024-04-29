import { LitElement, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import '../../common/system'

@customElement('tc-labels-text-list')
class LabelsTextListElement extends LitElement {
    @property({ type: Array })
    labels?: Array<string> = []

    render() {
        if (!this.labels?.length) return nothing

        return html`<tc-text small
            >${this.labels.map((label) => `@${label}`).join(', ')}</tc-text
        >`
    }
}
