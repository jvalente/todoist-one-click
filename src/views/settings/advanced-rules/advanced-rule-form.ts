import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { RuleMatchMode } from '../../../types/rules.types'
import { grid } from '../../common/styles/grid'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import type {
    InputChangeEvent,
    InputEnterPressEvent,
    SelectChangeEvent,
} from '../../common/system'

import '../../common/system'
import '../target-labels/target-labels-list'
import '../target-project/target-project-select'
import { matchModeDescription } from './constants'

@customElement('tc-advanced-rule-form')
export class AdvancedRuleFormElement extends LitElement {
    static styles = [
        grid,
        css`
            tc-text {
                white-space: nowrap;
            }
            tc-text-input {
                flex-grow: 1;
            }

            tc-project-select {
                width: 100%;
            }
        `,
    ]

    @property({ type: Array })
    projects: ProjectsState['data'] = []

    // QUIRK: if the attribute is explicitly set to undefined, the default value is not used
    @property({ type: Object })
    defaultRule!: Partial<Rule>

    @state()
    private rule!: Partial<Rule>

    firstUpdated() {
        this.rule = { ...this.defaultRule }
    }

    get query() {
        return this.rule.query || ''
    }

    private updateRule(update: Partial<Omit<Rule, 'id'>>) {
        this.rule = { ...this.rule, ...update }
    }

    private updateQuery(event: InputChangeEvent) {
        this.updateRule({ query: event.value })
    }

    private updateProject(event: CustomEvent) {
        this.updateRule({
            projectId: event.detail.projectId,
        })
    }

    private updateLabels(event: CustomEvent) {
        this.updateRule({
            labels: event.detail.labels,
        })
    }

    private updateDueDate(event: InputEnterPressEvent) {
        this.updateRule({
            dueDate: event.detail.value,
        })
    }

    private saveRule() {
        if (!this.rule.query) return

        const customEvent = new CustomEvent('save', {
            detail: { rule: this.rule },
        })

        this.dispatchEvent(customEvent)
    }

    private cancelEditRule() {
        const customEvent = new CustomEvent('cancel')
        this.dispatchEvent(customEvent)
    }

    private deleteRule() {
        const customEvent = new CustomEvent('delete', {
            detail: { ruleId: this.rule.id },
        })

        this.dispatchEvent(customEvent)
    }

    private renderFormActions() {
        return html`
            <div class="row spaceBetween">
                <div class="row">
                    <tc-button small @click=${this.saveRule}>Save</tc-button>
                    <tc-link
                        small
                        .confirmDialog=${
                            hasChanges(this.defaultRule, this.rule)
                                ? {
                                      message:
                                          'Discard the changes and back to the rules list?',
                                  }
                                : undefined
                        }
                        @click=${this.cancelEditRule}
                        >Cancel</tc-link
                    >
                </div>
                ${
                    this.rule.id
                        ? html` <tc-link
                          small
                          .confirmDialog=${{
                              message: `Delete the rule for ${this.query}?`,
                          }}
                          @click=${this.deleteRule}
                          >Delete</tc-link
                      >`
                        : nothing
                }
            </div>
        `
    }

    render() {
        if (!this.rule) return nothing

        return html`
            <div class="stack">
                <div class="row">
                    <tc-text small>If the url</tc-text>
                    <tc-select
                        small
                        .options=${matchModeSelectOptions()}
                        .selectedValue=${this.rule.matchMode as string}
                        @change=${(matchMode: SelectChangeEvent<any>) =>
                            this.updateRule({
                                matchMode: matchMode.selectedValue,
                            })}
                    ></tc-select>
                    <tc-text-input
                        small
                        .value=${this.query}
                        ?disableEnter=${true}
                        placeholder="url (required)"
                        @change=${this.updateQuery}
                    ></tc-text-input>
                </div>
                <div class="row">
                    <tc-text small>then add to project:</tc-text>
                    <tc-project-select
                        small
                        .rule=${this.rule}
                        .projects=${this.projects}
                        @change=${this.updateProject}
                    ></tc-project-select>
                </div>
                <div>
                    <tc-text small>add labels:</tc-text>
                </div>
                <div>
                    <tc-target-labels-list
                        small
                        .labels=${this.rule.labels}
                        @change=${this.updateLabels}
                    ></tc-target-labels-list>
                </div>
                <div>
                    <tc-text small
                        >and due date:
                        <code>${this.rule.dueDate || 'no date'}</code>.</tc-text
                    >
                </div>
                <div>
                    <tc-text-input
                        small
                        placeholder=${getInputPlaceholder(this.rule.dueDate)}
                        @enterPress=${this.updateDueDate}
                    ></tc-text-input>
                </div>
                ${this.renderFormActions()}
            </div>
        `
    }
}

function matchModeSelectOptions() {
    Object.values(RuleMatchMode)

    return Object.values(RuleMatchMode).map((matchMode) => [
        matchMode,
        matchModeDescription[matchMode],
    ])
}

function hasChanges(defaultRule: Partial<Rule>, rule: Partial<Rule>) {
    return JSON.stringify(defaultRule) !== JSON.stringify(rule)
}

function getInputPlaceholder(value?: string) {
    return `Type and press Enter to ${
        value ? 'change/delete the' : 'set a'
    } due date...`
}
