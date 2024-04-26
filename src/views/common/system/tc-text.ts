import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('tc-text')
class TextElement extends LitElement {
    static styles = css`
        p {
            margin: 0;
        }
        :host([small]) p {
            font-size: var(--small-font-size);
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

    render() {
        return html`<p><slot></slot></p>`
    }
}
