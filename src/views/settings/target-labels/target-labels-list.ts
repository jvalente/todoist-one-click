import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { InputEnterPressEvent } from '../../common/system'

import '../../common/system'
import './label-pill'

@customElement('tc-target-labels-list')
class TargetLabelsListElement extends LitElement {
    static styles = [
        css`
            ul {
                margin: 0 0 10px 0;
                display: flex;
                padding: 0;
                flex-wrap: wrap;
            }

            ul li {
                list-style-type: none;
                gap: 5px;
                margin: 5px 10px;
            }

            ul:first-child li {
                margin-left: 0;
            }
        `,
    ]

    @property({ type: Boolean })
    small = false

    @property({ type: Array })
    labels?: Array<string> = []

    private handleRemoveLabel(event: CustomEvent) {
        const { label } = event.detail
        this.labels = (this.labels || []).filter((l: string) => l !== label)
        this.dispatchLabelsChange()
    }

    private handleAddLabel(event: InputEnterPressEvent) {
        if (!event.detail.value) return
        // TODO: do not add if label already exists
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
                        <tc-label-pill
                            ?small=${this.small}
                            .label=${label}
                            @delete=${this.handleRemoveLabel}
                        ></tc-label-pill>
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
