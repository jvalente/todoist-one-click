import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-button')
export class ButtonElement extends LitElement {
    static styles = css`
        :host {
            display: inline-flex;
            vertical-align: middle;
        }

        button {
            box-sizing: border-box;
            width: 100%;
            padding: 12px 16px;
            border: 1px solid transparent;
            border-radius: 7px;
            font: inherit;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.5;
            color: var(--on-accent-color);
            background-color: var(--accent-color);
            cursor: pointer;
        }

        button:hover:enabled {
            background-color: var(--accent-color-hover);
        }

        button:focus-visible {
            outline: 2px solid var(--link-color);
            outline-offset: 3px;
        }

        :host([small]) button {
            padding: 6px 10px;
            font-size: 0.875rem;
        }

        :host([secondary]) button {
            color: var(--primary-color);
            background-color: var(--bg-color-1);
            border-color: var(--bg-color-3);
        }

        :host([secondary]) button:hover:enabled {
            background-color: var(--bg-color-2);
        }

        button:disabled,
        :host([secondary]) button:disabled {
            color: var(--secondary-color);
            background-color: var(--bg-color-2);
            border-color: transparent;
            cursor: default;
        }
    `

    @property({ type: Boolean, reflect: true })
    small = false

    @property({ type: Boolean, reflect: true })
    secondary = false

    @property({ type: Boolean, reflect: true })
    disabled = false

    render() {
        return html`<button type="button" ?disabled=${this.disabled}>
            <slot></slot>
        </button>`
    }
}
