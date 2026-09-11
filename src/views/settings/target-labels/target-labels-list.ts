import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { labelIcon } from '../../common/svg/label'
import type { InputChangeEvent, TextInputElement } from '../../common/system'
import type { TargetLabelPillElement } from './label-pill'

import '../../common/system'
import './label-pill'

@customElement('tc-target-labels-list')
export class TargetLabelsListElement extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        ul {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 0 0 24px;
            padding: 0;
            list-style: none;
        }

        li {
            display: flex;
            min-width: 0;
            max-width: 100%;
        }

        :host([small]) ul {
            margin-bottom: 12px;
        }

        .empty-state {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 0 0 24px;
            padding: 16px;
            border: 1px dashed var(--input-border-color);
            border-radius: 7px;
            background-color: var(--page-background-color);
            color: var(--secondary-color);
            font-size: 0.8125rem;
            line-height: 1.65;
        }

        .empty-state svg {
            flex-shrink: 0;
            width: 18px;
            height: 18px;
        }

        .status {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
            border: 0;
        }
    `

    @property({ type: Boolean, reflect: true })
    small = false

    @property({ type: Boolean })
    showAddHelp = true

    @property({ type: Array })
    labels?: Array<string> = []

    @state()
    private value = ''

    @state()
    private status = ''

    @query('tc-text-input')
    private input!: TextInputElement

    render() {
        return html`${this.renderLabelsList()}
            <tc-text-input
                ?small=${this.small}
                ?disableSpace=${true}
                label=${this.small ? '' : 'Add a label'}
                placeholder="e.g. reading"
                .value=${this.value}
                @change=${this.handleInputChange}
                @enterPress=${this.handleAddLabel}
            >
                <tc-button
                    slot="trailing"
                    secondary
                    ?small=${this.small}
                    ?disabled=${!this.value.trim()}
                    @click=${this.handleAddLabel}
                    >Add</tc-button
                >
                ${
                    this.showAddHelp
                        ? html`<span slot="help">Press Enter to add.</span>`
                        : nothing
                }
            </tc-text-input>
            <p class="status" role="status">${this.status}</p>`
    }

    private renderLabelsList() {
        if (!this.labels?.length) {
            return this.small
                ? nothing
                : html`<p class="empty-state">
                    ${labelIcon}<span>No labels added yet.</span>
                </p>`
        }

        return html`<ul aria-label="Target labels">
            ${repeat(
                this.labels,
                (label) => label,
                (label) =>
                    html`<li>
                        <tc-label-pill
                            .label=${label}
                            @delete=${this.handleRemoveLabel}
                        ></tc-label-pill>
                    </li>`,
            )}
        </ul>`
    }

    private handleInputChange(event: InputChangeEvent) {
        this.value = event.value
        this.status = ''
    }

    private handleAddLabel() {
        const label = this.value.trim()
        this.value = ''
        this.input.focus()
        if (!label) return

        if (this.labels?.includes(label)) {
            this.status = `${label} is already added.`
            return
        }

        this.labels = [...(this.labels || []), label]
        this.status = `Added ${label}.`
        this.dispatchLabelsChange()
    }

    private async handleRemoveLabel(event: CustomEvent<{ label: string }>) {
        const { label } = event.detail
        const index = (this.labels || []).indexOf(label)
        this.labels = (this.labels || []).filter((value) => value !== label)
        this.status = `Removed ${label}.`
        this.dispatchLabelsChange()

        await this.updateComplete
        const pills =
            this.renderRoot.querySelectorAll<TargetLabelPillElement>(
                'tc-label-pill',
            )
        const next = pills[Math.min(index, pills.length - 1)] || this.input
        next.focus()
    }

    private dispatchLabelsChange() {
        this.dispatchEvent(
            new CustomEvent('change', { detail: { labels: this.labels } }),
        )
    }
}
