import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { loading } from '../common/styles/loading'

@customElement('tc-loading')
export class LoadingElement extends LitElement {
    static styles = [loading]

    render() {
        return html`<div class="loader-container">
            <div class="loader"></div>
        </div>`
    }
}
