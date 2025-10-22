import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-button')
export class ButtonElement extends LitElement {
    static styles = [
        css`
            button {
                border: none;
                border-radius: var(--default-border-radius);
                padding: 10px;
                font-size: var(--global-font-size);
                color: var(--primary-color);
                background-color: var(--accent-color-0);
            }

            :host([small]) button {
                font-size: var(--small-font-size);
                padding: 7px;
            }

            :host([secondary]) button {
                background-color: var(--accent-color-2);
            }

            button:hover {
                background-color: var(--accent-color-1);
            }
        `,
    ]

    @property({ type: Boolean })
    small = false

    @property({ type: Boolean })
    secondary = false

    render() {
        return html`<button><slot></slot></button>`
    }
}
