import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { CheckboxChangeEvent } from './events'

@customElement('tc-checkbox')
export class CheckboxElement extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .control {
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }

            input {
                flex-shrink: 0;
                width: 16px;
                height: 16px;
                margin: 2px 0 0;
                accent-color: var(--link-color);
                cursor: pointer;
            }

            input:focus-visible {
                outline: 2px solid var(--link-color);
                outline-offset: 3px;
            }

            label {
                color: var(--primary-color);
                font-size: 0.875rem;
                font-weight: 600;
                line-height: 1.5;
                cursor: pointer;
            }

            input:disabled,
            input:disabled + label {
                color: var(--secondary-color);
                cursor: default;
            }

            .help {
                margin-left: 26px;
            }
        `,
    ]

    @property({ type: String })
    name = Date.now().toString()

    @property({ type: Boolean })
    checked = false

    @property({ type: Boolean, reflect: true })
    disabled = false

    handleEvent(event: Event) {
        event.preventDefault()

        const customEvent = new CheckboxChangeEvent(!this.checked)

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<div class="control">
            <input
                type="checkbox"
                id="${this.name}"
                name="${this.name}"
                .checked="${this.checked}"
                ?disabled=${this.disabled}
                aria-describedby="help"
                @change="${this.handleEvent}"
            />
            <label for="${this.name}"><slot></slot></label>
        </div>
        <div class="help" id="help"><slot name="help"></slot></div>`
    }
}
