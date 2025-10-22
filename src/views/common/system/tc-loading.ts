import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import './tc-text'

@customElement('tc-loading')
class LoadingElement extends LitElement {
    static styles = [
        // https://css-loaders.com/spinner/#l1
        css`
            .loader-container {
                margin: 10px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            .loader {
                width: 20px;
                aspect-ratio: 1;
                border-radius: 50%;
                border: 6px solid;
                border-color: var(--secondary-color) transparent;
                animation: l1 1s infinite;
            }

            @keyframes l1 {
                to {
                    transform: rotate(0.5turn);
                }
            }
        `,
    ]

    @property({ type: String })
    description?: string

    render() {
        return html`<div class="loader-container">
            ${
                this.description
                    ? html`<tc-text small secondary>${this.description}</tc-text>`
                    : nothing
            }
            <div class="loader"></div>
        </div>`
    }
}
