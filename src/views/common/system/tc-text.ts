import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-text')
export class TextElement extends LitElement {
    static styles = css`
        p {
            margin: 0;
        }
        :host([small]) p {
            font-size: var(--small-font-size);
        }

        :host([bold]) p {
            font-weight: bold;
        }

        :host([secondary]) p {
            color: var(--secondary-color);
        }

        ::slotted(code) {
            background-color: var(--bg-color-4);
            padding: 3px;
            border-radius: var(--default-border-radius);
        }
    `

    @property({ type: Boolean })
    bold = false

    @property({ type: Boolean })
    small = false

    @property({ type: Boolean })
    secondary = false

    render() {
        return html`<p><slot></slot></p>`
    }
}
