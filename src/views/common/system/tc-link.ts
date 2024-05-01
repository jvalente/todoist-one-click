import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('tc-link')
class LinkElement extends LitElement {
    static styles = css`
        a {
            color: var(--accent-color-0);
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
    `

    @query('dialog')
    dialog!: HTMLDialogElement

    @property({ type: Boolean })
    small = false

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
                <button @click=${this.continueEvent}>
                    ${this.confirmDialog.confirm || 'Confirm'}</button
                ><button @click=${this.abortEvent}>
                    ${this.confirmDialog.cancel || 'Cancel'}
                </button>
            </dialog>`
        }

        return nothing
    }

    render() {
        if (this.href) {
            return html`<a href="${this.href}" target="_blank"
                ><slot></slot
            ></a>`
        }

        return html`<a href="#" @click=${this._onClick}><slot></slot></a>
            ${this.renderDialog()}`
    }
}
