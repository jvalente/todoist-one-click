import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { CheckboxChangeEvent } from './events'

@customElement('tc-checkbox')
export class CheckboxElement extends LitElement {
    static styles = [
        css`
            div {
                display: flex;
                margin: 5px 0;
            }

            label {
                margin-left: 5px;
            }
        `,
    ]

    @property({ type: String })
    name = Date.now().toString()

    @property({ type: Boolean })
    checked = false

    handleEvent(event: Event) {
        event.preventDefault()

        const customEvent = new CheckboxChangeEvent(!this.checked)

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<div>
            <input
                type="checkbox"
                id="${this.name}"
                name="${this.name}"
                .checked="${this.checked}"
                @change="${this.handleEvent}"
            />
            <label for="${this.name}">
                <tc-text><slot></slot></tc-text>
            </label>
        </div>`
    }
}
