import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { deleteIcon } from '../../common/svg/delete'

import '../../common/system'

@customElement('tc-label-pill')
class TargetLabelPillElement extends LitElement {
    static styles = [
        css`
            div {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 5px;
                background-color: var(--bg-color-4);
                border-radius: var(--default-border-radius);
            }

            svg > * {
                fill: var(--accent-color-0);
            }
        `,
    ]

    @property({ type: Boolean })
    small = false

    @property({ type: String })
    label = ''

    private handleDeleteLabel(event: Event) {
        event.preventDefault()

        this.dispatchEvent(
            new CustomEvent('delete', { detail: { label: this.label } }),
        )
    }

    render() {
        return html`<div>
            <tc-text ?small=${this.small}>${this.label}</tc-text>
            <tc-link ?small=${this.small} @click=${this.handleDeleteLabel}
                >${deleteIcon}</tc-link
            >
        </div>`
    }
}
