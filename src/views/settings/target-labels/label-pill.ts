import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { deleteIcon } from '../../common/svg/delete'
import { labelIcon } from '../../common/svg/label'
import type { ButtonElement } from '../../common/system'

import '../../common/system'

@customElement('tc-label-pill')
export class TargetLabelPillElement extends LitElement {
    static styles = css`
            :host {
                display: inline-flex;
                max-width: 100%;
            }

            div {
                box-sizing: border-box;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                max-width: 100%;
                min-width: 0;
                padding: 3px 4px 3px 10px;
                border: 1px solid var(--section-border-color);
                border-radius: 6px;
                background-color: var(--disabled-background-color);
                color: var(--primary-color);
                font-size: 0.8125rem;
                line-height: 1.5;
            }

            .label-icon,
            tc-button {
                flex-shrink: 0;
            }

            .label-icon {
                color: var(--secondary-color);
            }

            span {
                min-width: 0;
                overflow-wrap: anywhere;
            }
    `

    @property({ type: String })
    label = ''

    focus(options?: FocusOptions) {
        this.renderRoot
            .querySelector<ButtonElement>('tc-button')
            ?.focus(options)
    }

    render() {
        return html`<div>
            ${labelIcon}
            <span>${this.label}</span>
            <tc-button icon .label=${`Remove ${this.label}`} title=${`Remove ${this.label}`} @click=${this.handleDeleteLabel}
                >${deleteIcon}</tc-button
            >
        </div>`
    }

    private handleDeleteLabel() {
        this.dispatchEvent(
            new CustomEvent('delete', { detail: { label: this.label } }),
        )
    }
}
