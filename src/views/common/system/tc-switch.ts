import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SwitchChangeEvent } from './events'

@customElement('tc-switch')
export class SwitchElement extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .control {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
        }

        .copy {
            flex: 1;
            min-width: 0;
        }

        label {
            display: block;
            color: var(--primary-color);
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1.5;
            cursor: pointer;
        }

        .help {
            color: var(--secondary-color);
        }

        ::slotted([slot='help']) {
            display: block;
            margin: 6px 0 0;
            font-size: 0.75rem;
            line-height: 1.65;
        }

        input {
            box-sizing: border-box;
            appearance: none;
            position: relative;
            flex-shrink: 0;
            width: 40px;
            height: 24px;
            margin: 0;
            border: 1px solid var(--input-border-color);
            border-radius: 999px;
            background-color: var(--input-border-color);
            cursor: pointer;
            transition: background-color 150ms, border-color 150ms;
        }

        input::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: var(--on-accent-color);
            box-shadow: 0 1px 2px #00000026;
            transition: transform 150ms;
        }

        input:checked {
            background-color: var(--link-color);
            border-color: var(--link-color);
        }

        input:checked::before {
            transform: translateX(16px);
        }

        input:focus-visible {
            outline: 2px solid var(--link-color);
            outline-offset: 3px;
        }

        input:disabled {
            opacity: 0.5;
            cursor: default;
        }

        :host([disabled]) label {
            color: var(--secondary-color);
            cursor: default;
        }

        @media (prefers-reduced-motion: reduce) {
            input,
            input::before {
                transition: none;
            }
        }
    `

    @property({ type: String })
    name = ''

    @property({ type: Boolean })
    checked = false

    @property({ type: Boolean, reflect: true })
    disabled = false

    render() {
        return html`<div class="control">
            <div class="copy">
                <label for="switch"><slot></slot></label>
                <div class="help" id="help"><slot name="help"></slot></div>
            </div>
            <input
                type="checkbox"
                role="switch"
                id="switch"
                name=${this.name}
                .checked=${this.checked}
                ?disabled=${this.disabled}
                aria-checked=${String(this.checked)}
                aria-describedby="help details"
                @change=${this.handleChange}
            />
        </div>
        <div id="details"><slot name="details"></slot></div>`
    }

    private handleChange(event: Event) {
        const { checked } = event.target as HTMLInputElement
        this.dispatchEvent(new SwitchChangeEvent(checked))
    }
}
