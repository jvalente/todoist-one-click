import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { fieldStyles } from '../styles/field'
import { InputChangeEvent, InputEnterPressEvent } from './events'

@customElement('tc-text-input')
export class TextInputElement extends LitElement {
    static styles = [
        fieldStyles,
        css`
            .control {
                display: flex;
                align-items: stretch;
                gap: 8px;
            }

            ::slotted([slot='trailing']) {
                flex-shrink: 0;
            }

            input {
                box-sizing: border-box;
                flex: 1;
                min-width: 0;
                width: 100%;
                padding: 12px;
                border: 1px solid var(--input-border-color);
                border-radius: 7px;
                outline: none;
                font: inherit;
                font-size: 0.875rem;
                line-height: 1.5;
                color: var(--primary-color);
                background-color: var(--bg-color-0);
            }

            input::placeholder {
                color: var(--secondary-color);
                opacity: 1;
            }

            input:focus {
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px var(--focus-ring-color);
            }

            input:disabled {
                color: var(--secondary-color);
                background-color: var(--bg-color-2);
                cursor: default;
            }

            :host([small]) input {
                padding: 6px 8px;
                font-size: 0.875rem;
            }
        `,
    ]

    @property({ type: Boolean, reflect: true })
    small = false

    @property({ type: String })
    placeholder = ''

    @property({ type: String })
    label = ''

    @property({ type: String })
    type: 'text' | 'password' = 'text'

    @property({ type: String })
    value = ''

    @property({ type: Boolean, reflect: true })
    disabled = false

    @property({ type: Boolean })
    disableSpace = false

    @property({ type: Boolean })
    disableEnter = false

    @property({ type: Boolean })
    autofocus = false

    focus(options?: FocusOptions) {
        this.renderRoot.querySelector('input')?.focus(options)
    }

    // TODO: handle paste event

    private handleKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter' && !this.disableEnter) {
            this.dispatchEvent(new InputEnterPressEvent(this.value))
        }
    }

    private handleKeydown(event: KeyboardEvent) {
        const { key, code } = event

        if (this.disableSpace && (key === ' ' || code === 'Space')) {
            event.preventDefault()
        }
    }

    private handleInput(event: InputEvent) {
        const { value } = event.target as HTMLInputElement
        this.value = value
        this.dispatchEvent(new InputChangeEvent(value))
    }

    private renderHeading() {
        if (!this.label) return nothing

        return html`<div class="heading">
            <label for="input">${this.label}</label>
            <slot name="action"></slot>
        </div>`
    }

    render() {
        return html`${this.renderHeading()}
            <div class="control">
                <input
                    id="input"
                    type=${this.type}
                    placeholder=${this.placeholder}
                    .value=${this.value}
                    ?disabled=${this.disabled}
                    aria-describedby="help"
                    @input=${this.handleInput}
                    @keydown=${this.handleKeydown}
                    @keyup=${this.handleKeyup}
                    ?autofocus=${this.autofocus}
                />
                <slot name="trailing"></slot>
            </div>
            <div class="help" id="help"><slot name="help"></slot></div>`
    }
}
