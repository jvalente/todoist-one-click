import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import '../../common/system'
import type { CheckboxChangeEvent } from '../../common/system'

@customElement('tc-project-guess')
export class ProjectGuessElement extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding-top: 24px;
            border-top: 1px solid var(--section-border-color);
        }

        .details {
            color: var(--secondary-color);
            font-size: 0.75rem;
            line-height: 1.65;
        }

        p {
            margin: 6px 0 0;
        }

        .sharing-note {
            margin-top: 12px;
        }

        strong {
            color: var(--primary-color);
            font-weight: 500;
        }

        tc-link {
            --link-color: var(--secondary-color);
        }
    `

    @property({ type: Boolean })
    checked = true

    @property({ type: String })
    fallbackProject?: string

    private handleCheckedToggle(event: CheckboxChangeEvent) {
        const customEvent = new CustomEvent('change', {
            detail: { checked: event.checked },
        })

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<tc-checkbox
            name="toggle-guess-project"
            .checked=${this.checked}
            @change=${this.handleCheckedToggle}
        >
            Guess the project with AI
            <div slot="help" class="details">
                <p>Use the page title and URL to find a suitable project.</p>
                ${
                    this.checked
                        ? html`<p>
                            If no match is found, tasks go to
                            <strong>${this.fallbackProject || 'the default project'}</strong>.
                        </p>`
                        : nothing
                }
                <p class="sharing-note">
                    When enabled, your project names, page title and URL are
                    sent to
                    <tc-link
                        href="https://help.openai.com/en/collections/6864268-privacy-and-policies"
                        >OpenAI</tc-link
                    >.
                </p>
            </div>
        </tc-checkbox>`
    }
}
