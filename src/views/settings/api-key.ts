import { css, html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { setAPIKey } from '../../controllers/api-key'
import type { InputChangeEvent } from '../common/system'

import '../common/system'

@customElement('tc-api-key')
export class ApiKeyElement extends LitElement {
    static styles = css`
        .storage-note {
            display: flex;
            align-items: flex-start;
            gap: 9px;
            padding-top: 20px;
            border-top: 1px solid var(--section-border-color);
            color: var(--secondary-color);
        }

        .storage-note svg {
            flex-shrink: 0;
            margin-top: 2px;
        }

        .storage-note p {
            margin: 0;
            font-size: 0.75rem;
            line-height: 1.65;
        }

        .navigation-path {
            color: var(--primary-color);
            font-weight: 500;
        }
    `

    @state()
    private apiKey = ''

    private handleInputChange(event: InputChangeEvent) {
        this.apiKey = event.value
    }

    private handleOnClick() {
        const apiKey = this.apiKey.trim()
        if (apiKey) setAPIKey(apiKey)
    }

    render() {
        return html`<tc-section title="Connect Todoist">
            <tc-text-input
                label="API token"
                type="password"
                placeholder="Paste your API token"
                @change=${this.handleInputChange}
                @enterPress=${this.handleOnClick}
                ?autofocus=${true}
                ?disableSpace=${true}
            >
                <tc-link
                    external
                    small
                    slot="action"
                    href="https://app.todoist.com/app/settings/integrations/developer"
                    >Find your token</tc-link
                >
                <span slot="help">
                    In Todoist, go to
                    <strong class="navigation-path"
                        >Settings → Integrations → Developer</strong
                    >
                    and copy your API token.
                </span>
            </tc-text-input>
            <tc-button
                ?disabled=${!this.apiKey.trim()}
                @click=${this.handleOnClick}
                >Save token</tc-button
            >
            <div class="storage-note">
                <svg
                    viewBox="0 0 20 20"
                    width="16"
                    height="16"
                    fill="none"
                    aria-hidden="true"
                >
                    <rect
                        x="4.5"
                        y="9"
                        width="11"
                        height="8"
                        rx="2"
                        stroke="currentColor"
                        stroke-width="1.4"
                    ></rect>
                    <path
                        d="M7 9V6a3 3 0 0 1 6 0v3M10 12v2"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                    ></path>
                </svg>
                <p>
                    Your token is stored locally in this browser and used to
                    connect to Todoist.
                </p>
            </div>
        </tc-section>`
    }
}
