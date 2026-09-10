import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { fieldStyles } from '../styles/field'
import { SelectChangeEvent } from './events'

@customElement('tc-select')
export class SelectElement extends LitElement {
    static styles = [
        fieldStyles,
        css`
            .control {
                position: relative;
            }

            select {
                appearance: none;
                box-sizing: border-box;
                width: 100%;
                padding: 12px 40px 12px 12px;
                border: 1px solid var(--input-border-color);
                border-radius: 7px;
                outline: none;
                font: inherit;
                font-size: 0.875rem;
                line-height: 1.5;
                color: var(--primary-color);
                background-color: var(--bg-color-0);
                cursor: pointer;
            }

            select:focus {
                border-color: var(--accent-color);
                box-shadow: 0 0 0 3px var(--focus-ring-color);
            }

            select:disabled {
                color: var(--secondary-color);
                background-color: var(--bg-color-2);
                cursor: default;
            }

            :host([small]) select {
                padding: 6px 32px 6px 8px;
            }

            svg {
                position: absolute;
                top: 50%;
                right: 12px;
                transform: translateY(-50%);
                color: var(--secondary-color);
                pointer-events: none;
            }
        `,
    ]

    @property({ type: Boolean, reflect: true })
    small = false

    @property({ type: Boolean, reflect: true })
    disabled = false

    @property({ type: String })
    label = ''

    @property({ type: Array })
    options: Array<string | string[]> = []

    @property({ type: String })
    selectedValue = ''

    handleEvent(event: Event) {
        event.preventDefault()

        const customEvent = new SelectChangeEvent(
            (event.target as HTMLSelectElement).value,
        )

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`${this.renderHeading()}
            <div class="control">
                <select
                    id="select"
                    ?disabled=${this.disabled}
                    aria-describedby="help"
                    @change=${this.handleEvent}
                >
                    <option value="" disabled selected>Select your option</option>
                    ${repeat(
                        this.options,
                        (option) => getOptionValue(option),
                        (option) =>
                            html`<option
                                value=${getOptionValue(option)}
                                ?selected=${
                                    getOptionValue(option) ===
                                    this.selectedValue
                                }
                            >
                                ${getOptionContent(option)}
                            </option>`,
                    )}
                </select>
                <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="m4 6 4 4 4-4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </div>
            <div class="help" id="help"><slot name="help"></slot></div>`
    }

    private renderHeading() {
        if (!this.label) return nothing

        return html`<div class="heading">
            <label for="select">${this.label}</label>
            <slot name="action"></slot>
        </div>`
    }
}

function getOptionValue(option: string | string[]) {
    return Array.isArray(option) ? option[0] : option
}

function getOptionContent(option: string | string[]) {
    return Array.isArray(option) ? option[1] : option
}
