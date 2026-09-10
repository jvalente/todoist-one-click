import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { grid } from '../styles/grid'

import './tc-button'

@customElement('tc-link')
export class LinkElement extends LitElement {
    static styles = [
        grid,
        css`
            a {
                color: var(--link-color);
            }

            :host([external]) a {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                text-decoration: none;
            }

            :host([external]) a:hover {
                text-decoration: underline;
                text-underline-offset: 3px;
            }

            :host([small]) a {
                font-size: var(--small-font-size);
            }

            dialog {
                background-color: var(--bg-color-3);
                color: var(--primary-color);
                border: none;
                border-radius: var(--default-border-radius);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }

            dialog::backdrop {
                background-color: var(--bg-color-0);
                opacity: 0.75;
            }
        `,
    ]

    @query('dialog')
    dialog!: HTMLDialogElement

    @property({ type: Boolean })
    small = false

    @property({ type: Boolean, reflect: true })
    external = false

    @property({ type: String })
    href?: string

    @property({ type: Object })
    confirmDialog?: { message: string; confirm?: string; cancel?: string }

    private pausedEvent?: Event = undefined

    private _onClick(event: Event) {
        event.preventDefault()

        if (this.confirmDialog) {
            event.stopPropagation()

            this.pausedEvent = event
            this.dialog.showModal()
        }
    }

    // TODO: Controller? Mixin?
    continueEvent(event: Event) {
        event.preventDefault()
        event.stopPropagation()
        this.dialog.close()

        if (!this.pausedEvent) return

        this.dispatchEvent(this.pausedEvent)
        this.pausedEvent = undefined
    }

    abortEvent(event: Event) {
        event.preventDefault()
        event.stopPropagation()
        this.dialog.close()
        this.pausedEvent = undefined
    }

    handleDialogClickEvent(event: Event) {
        // otherwise click will bubble to the tc-link parent element
        event.preventDefault()
        event.stopPropagation()
    }

    private renderDialog() {
        if (this.confirmDialog) {
            return html`<dialog @click=${this.handleDialogClickEvent}>
                <p>${this.confirmDialog.message}</p>
                <div class="row flexEnd">
                    <tc-button secondary small @click=${this.abortEvent}>
                        ${this.confirmDialog.cancel || 'Cancel'}
                    </tc-button>
                    <tc-button small @click=${this.continueEvent}>
                        ${this.confirmDialog.confirm || 'Confirm'}</tc-button
                    >
                </div>
            </dialog>`
        }

        return nothing
    }

    private renderExternalIcon() {
        if (!this.external) return nothing

        return html`<svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M5 3.5h7.5V11M12.5 3.5l-9 9"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></path>
        </svg>`
    }

    render() {
        if (this.href) {
            return html`<a href="${this.href}" target="_blank" rel="noreferrer"
                ><slot></slot>${this.renderExternalIcon()}</a
            >`
        }

        return html`<a href="#" @click=${this._onClick}><slot></slot></a>
            ${this.renderDialog()}`
    }
}
