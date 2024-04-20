import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-al')
export class ActionLinkElement extends LitElement {
    static styles = css`
        a {
            color: var(--accent-color-0);
        }
    `

    private _onClick(event: Event) {
        event.preventDefault()
    }

    render() {
        return html`<a href="#" @click=${this._onClick}><slot></slot></a>`
    }
}
