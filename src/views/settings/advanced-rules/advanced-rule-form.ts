import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { RuleMatchMode } from '../../../types/rules.types'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import type {
    DueDateChangeEvent,
    InputChangeEvent,
    SelectChangeEvent,
} from '../../common/system'

import '../../common/system'
import '../target-labels/target-labels-list'
import '../target-project/target-project-select'
import { matchModeDescription } from './constants'

@customElement('tc-advanced-rule-form')
export class AdvancedRuleFormElement extends LitElement {
    static styles = css`
        fieldset {
            min-width: 0;
            padding: 0;
            margin: 0;
            border: 0;
        }

        legend {
            padding: 0;
            margin-bottom: 16px;
            font-size: 0.9375rem;
            font-weight: 650;
        }

        fieldset + fieldset {
            margin-top: 28px;
        }

        tc-text-input + tc-text-input,
        tc-select + tc-text-input,
        tc-project-select,
        tc-target-labels-list,
        tc-due-date-control {
            display: block;
            margin-top: 20px;
        }

        .note {
            margin: 24px 0 0;
            color: var(--secondary-color);
            font-size: 0.75rem;
            line-height: 1.65;
        }

        .actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid var(--section-border-color);
        }

        .save-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-left: auto;
        }
    `

    @property({ type: Array })
    projects: ProjectsState['data'] = { results: [] }

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

    private updateDueDate(event: DueDateChangeEvent) {
        this.updateRule({
            dueDate: event.dueDate,
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
        return html`<div class="actions">
                <div class="save-actions">
                    <tc-button @click=${this.saveRule}>Save rule</tc-button>
                    <tc-link
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
                        ? html`<tc-link
                              .confirmDialog=${{
                                  message: `Delete the rule for ${this.query}?`,
                              }}
                              @click=${this.deleteRule}
                              >Delete rule</tc-link
                          >`
                        : nothing
                }
            </div>`
    }

    render() {
        if (!this.rule) return nothing

        return html`<div>
                <fieldset>
                    <legend>When</legend>
                    <tc-select
                        label="The URL"
                        .options=${matchModeSelectOptions()}
                        .selectedValue=${this.rule.matchMode as string}
                        @change=${(matchMode: SelectChangeEvent<any>) =>
                            this.updateRule({
                                matchMode: matchMode.selectedValue,
                            })}
                    >
                        <span slot="help">${this.matchHelp}</span>
                    </tc-select>
                    <tc-text-input
                        label="URL or text"
                        .value=${this.query}
                        ?disableEnter=${true}
                        placeholder="e.g. github.com/"
                        @change=${this.updateQuery}
                    ></tc-text-input>
                </fieldset>
                <fieldset>
                    <legend>Create the task with</legend>
                    <tc-project-select
                        label="Project"
                        .rule=${this.rule}
                        .projects=${this.projects}
                        @change=${this.updateProject}
                    ></tc-project-select>
                    <tc-target-labels-list
                        .showAddHelp=${false}
                        .labels=${this.rule.labels}
                        @change=${this.updateLabels}
                    ></tc-target-labels-list>
                    <tc-due-date-control
                        .dueDate=${this.rule.dueDate || ''}
                        @change=${this.updateDueDate}
                    ></tc-due-date-control>
                </fieldset>
                <p class="note">
                    These settings replace your defaults for matching pages.
                </p>
                ${this.renderFormActions()}
            </div>`
    }

    private get matchHelp() {
        return this.rule.matchMode === RuleMatchMode.Contains
            ? 'Matches part of the URL. Letter case does not matter.'
            : 'Matches the whole URL. Letter case does not matter.'
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
