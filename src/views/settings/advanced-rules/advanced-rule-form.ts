import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { Rule } from '../../../types/rules.types'
import type {
    InputChangeEvent,
    InputEnterPressEvent,
    SelectChangeEvent,
} from '../../common/system'

import type { ProjectsState } from '../../../types/projects.types'

import '../../common/system'
import '../target-labels/target-labels-list'
import '../target-project/target-project-select'

@customElement('tc-advanced-rule-form')
class AdvancedRuleFormElement extends LitElement {
    static styles = [
        css`
            div > {
                margin: 5;
            }

            div {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 5px 0;
            }

            tc-text-input {
                flex-grow: 1;
            }
        `,
    ]

    @property({ type: Array })
    projects: ProjectsState['data'] = []

    // QUIRK: if the attribute is explicitly set to undefined, the default value is not used
    @property({ type: Object, converter: (value: any) => JSON.parse(value) })
    rule: Partial<Rule> = { matchMode: 'contains' }

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
        const customEvent = new CustomEvent('save', {
            detail: { rule: this.rule },
        })

        this.dispatchEvent(customEvent)
    }

    private cancelEditRule() {
        const customEvent = new CustomEvent('cancel', {
            detail: { ruleId: this.rule.id },
        })

        this.dispatchEvent(customEvent)
    }

    private deleteRule() {
        const customEvent = new CustomEvent('delete', {
            detail: { ruleId: this.rule.id },
        })

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`
            <div>
                <tc-text small>If the tab url</tc-text>
                <tc-select
                    small
                    .options=${['contains', 'is exactly', 'matches regex']}
                    .selectedValue=${'contains'}
                    @change=${(matchMode: SelectChangeEvent<any>) =>
                        this.updateRule({ matchMode: matchMode.selectedValue })}
                ></tc-select>
                <tc-text-input
                    small
                    .value=${this.query}
                    placeholder="url"
                    @change=${this.updateQuery}
                ></tc-text-input>
            </div>
            <tc-text small>then add to project:</tc-text>
            <tc-project-select
                small
                .rule=${this.rule}
                .projects=${this.projects}
                @change=${this.updateProject}
            ></tc-project-select>
            <tc-text small>then add labels:</tc-text>
            <tc-target-labels-list
                small
                .labels=${this.rule.labels}
                @change=${this.updateLabels}
            ></tc-target-labels-list>
            <tc-text small
                >and due date:
                <code>${this.rule.dueDate || 'no date'}</code>.</tc-text
            >
            <tc-text-input
                small
                placeholder="due date..."
                @enterPress=${this.updateDueDate}
            ></tc-text-input>
            <button @click=${this.saveRule}>Save</button>
            <tc-link @click=${this.cancelEditRule}>Cancel</tc-link>
            <tc-link @click=${this.deleteRule}>Delete</tc-link>
        `
    }
}
