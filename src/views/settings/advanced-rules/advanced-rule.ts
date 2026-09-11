import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'

import '../../common/system'
import '../target-labels/labels-text-list'
import { matchModeDescription } from './constants'

@customElement('tc-advanced-rule')
export class AdvancedRuleElement extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        article {
            padding: 10px 12px;
            border: 1px solid var(--section-border-color);
            border-radius: 8px;
        }

        .heading,
        .condition,
        .actions,
        .outcome {
            display: flex;
            align-items: center;
        }

        .heading {
            justify-content: space-between;
            gap: 6px;
        }

        .condition {
            gap: 6px;
            color: var(--secondary-color);
            font-size: 0.75rem;
        }

        .number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 19px;
            height: 19px;
            padding: 0 3px;
            border-radius: 5px;
            color: var(--primary-color);
            background-color: var(--disabled-background-color);
            font-size: 0.6875rem;
            font-weight: 600;
        }

        .actions {
            gap: 4px;
            margin-left: auto;
        }

        .edit {
            margin-left: 4px;
        }

        h3 {
            margin: 0 0 3px;
            overflow-wrap: anywhere;
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1.5;
        }

        .outcome {
            flex-wrap: wrap;
            gap: 2px 10px;
            overflow-wrap: anywhere;
            font-size: 0.75rem;
            line-height: 1.5;
        }

        .project {
            font-weight: 500;
        }

        .detail {
            color: var(--secondary-color);
        }
    `

    @property({ type: Object })
    rule!: Rule

    @property({ type: Array })
    projects?: ProjectsState['data'] = { results: [] }

    @property({ type: Number })
    position = 0

    @property({ type: Boolean })
    isFirst = false

    @property({ type: Boolean })
    isLast = false

    private handleEditRule() {
        const customEvent = new CustomEvent('editRule', {
            detail: { ruleId: this.rule.id },
            bubbles: true,
            composed: true,
        })

        this.dispatchEvent(customEvent)
    }

    private handleMoveRule(direction: -1 | 1) {
        this.dispatchEvent(
            new CustomEvent('moveRule', {
                detail: { ruleId: this.rule.id, direction },
                bubbles: true,
                composed: true,
            }),
        )
    }

    private get projectName() {
        const project = this.projects?.results?.find(
            (p) => p.id === this.rule.projectId,
        )
        return project?.name || 'Inbox'
    }

    render() {
        return html`<article>
            <div class="heading">
                <div class="condition">
                    <span class="number" aria-hidden="true"
                        >${this.position + 1}</span
                    >
                    <span>URL ${matchModeDescription[this.rule.matchMode]}</span>
                </div>
                <div class="actions">
                    <tc-button
                        icon
                        .label=${`Move rule ${this.position + 1} up`}
                        ?disabled=${this.isFirst}
                        @click=${() => this.handleMoveRule(-1)}
                        ><span aria-hidden="true">↑</span></tc-button
                    >
                    <tc-button
                        icon
                        .label=${`Move rule ${this.position + 1} down`}
                        ?disabled=${this.isLast}
                        @click=${() => this.handleMoveRule(1)}
                        ><span aria-hidden="true">↓</span></tc-button
                    >
                    <tc-button text class="edit" @click=${this.handleEditRule}
                        >Edit</tc-button
                    >
                </div>
            </div>
            <h3>${this.rule.query}</h3>
            <div class="outcome">
                <span class="project">${this.projectName}</span>
                ${
                    this.rule.labels?.length
                        ? html`<tc-labels-text-list
                              .labels=${this.rule.labels}
                          ></tc-labels-text-list>`
                        : nothing
                }
                ${
                    this.rule.dueDate
                        ? html`<span class="detail">Due ${this.rule.dueDate}</span>`
                        : nothing
                }
            </div>
        </article>`
    }
}
