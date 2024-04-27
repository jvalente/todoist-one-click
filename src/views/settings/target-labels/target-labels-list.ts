import { LitElement, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { horizontalList } from '../../common/styles/horizontal-list'
import { deleteIcon } from '../../common/svg/delete'

import type { InputEnterPressEvent } from '../../common/system'

import '../../common/system'

@customElement('tc-target-labels-list')
class TargetLabelsListElement extends LitElement {
    static styles = [horizontalList]

    @property({ type: Boolean })
    small = false

    @property({ type: Array })
    labels?: Array<string> = []

    private handleRemoveLabel(label: string) {
        this.labels = (this.labels || []).filter((l: string) => l !== label)
        this.dispatchLabelsChange()
    }

    private handleAddLabel(event: InputEnterPressEvent) {
        this.labels = [...(this.labels || []), event.detail.value]
        this.dispatchLabelsChange()
    }

    private dispatchLabelsChange() {
        const customEvent = new CustomEvent('change', {
            detail: { labels: this.labels },
        })

        this.dispatchEvent(customEvent)
    }

    private renderLabelsList() {
        if (!this.labels?.length) return nothing

        return html`<ul>
            ${repeat(
                this.labels,
                (label) => label,
                (label) =>
                    html`<li>
                        ${label}<tc-link
                            @click=${() => this.handleRemoveLabel(label)}
                            >${deleteIcon}</tc-link
                        >
                    </li>`,
            )}
        </ul>`
    }

    render() {
        return html`${this.renderLabelsList()}
            <tc-text-input
                ?small=${this.small}
                ?disableSpace=${true}
                placeholder="Type and press Enter to add a label..."
                @enterPress=${this.handleAddLabel}
            >
            </tc-text-input>`
    }
}
