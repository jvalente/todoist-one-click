import { html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { grid } from '../../common/styles/grid'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'

import '../../common/system'
import '../target-labels/labels-text-list'
import { matchModeDescription } from './constants'

@customElement('tc-advanced-rule')
export class AdvancedRuleElement extends LitElement {
    static styles = [grid]

    @property({ type: Object })
    rule!: Rule

    @property({ type: Array })
    projects?: ProjectsState['data'] = []

    private handleEditRule() {
        const customEvent = new CustomEvent('editRule', {
            detail: { ruleId: this.rule.id },
            bubbles: true,
            composed: true,
        })

        this.dispatchEvent(customEvent)
    }

    private get projectName() {
        const project = this.projects?.find((p) => p.id === this.rule.projectId)
        return project?.name || 'Inbox'
    }

    render() {
        return html`
            <div class="row spaceBetween">
                <div>
                    <tc-text bold small
                        >url ${matchModeDescription[this.rule.matchMode]}:
                        ${this.rule.query}</tc-text
                    >
                    <div class="row">
                        <tc-text small>#${this.projectName}</tc-text>
                        ${
                            this.rule.labels?.length
                                ? html`<tc-labels-text-list
                                  .labels=${this.rule.labels}
                              ></tc-labels-text-list>`
                                : nothing
                        }
                        ${
                            this.rule.dueDate
                                ? html`<tc-text small
                                  >${this.rule.dueDate}</tc-text
                              >`
                                : nothing
                        }
                    </div>
                </div>
                <div>
                    <tc-link small @click=${this.handleEditRule}>Edit</tc-link>
                </div>
            </div>
        `
    }
}
