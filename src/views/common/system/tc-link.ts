import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-link')
export class ActionLinkElement extends LitElement {
    static styles = css`
        a {
            color: var(--accent-color-0);
        }
    `

    @property({ type: String })
    href?: string

    private _onClick(event: Event) {
        event.preventDefault()
    }

    render() {
        if (this.href) {
            return html`<a href="${this.href}" target="_blank"
                ><slot></slot
            ></a>`
        } else {
            return html`<a href="#" @click=${this._onClick}><slot></slot></a>`
        }
    }
}
