import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-text')
export class TextElement extends LitElement {
    static styles = css`
        p {
            margin: 0;
        }
        :host([small]) p {
            font-size: smaller;
        }

        :host([secondary]) p {
            color: var(--secondary-color);
        }
    `

    render() {
        return html`<p><slot></slot></p>`
    }
}
