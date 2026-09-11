import { html, LitElement, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
    addRule,
    deleteRule,
    moveRule,
    updateRule,
} from '../../../controllers/rules'
import Projects from '../../../models/projects'
import Rules from '../../../models/rules'
import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

import '../../common/system'
import './advanced-rule-form'
import './advanced-rules-list'

const DEFAULT_RULE = { matchMode: 'contains', dueDate: 'today' }

@customElement('tc-advanced-rules-section')
export class AdvancedRulesSectionElement extends LitElement {
    @state()
    private rules: RulesState['data'] = []

    @state()
    private projects: ProjectsState['data'] = { results: [] }

    @state()
    private editingRuleId?: string

    @state()
    private addingRule = false

    private unsubscribers: Array<() => void> = []

    connectedCallback() {
        super.connectedCallback()

        this.unsubscribers.push(Rules.attach(this.onRulesUpdate))
        Rules.hydrate()

        this.unsubscribers.push(Projects.attach(this.onProjectsUpdate))
        Projects.hydrate()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        for (const unsubscribe of this.unsubscribers) unsubscribe()
        this.unsubscribers = []
    }

    private onProjectsUpdate = ({ data }: ProjectsState) => {
        this.projects = data
    }

    private onRulesUpdate = ({ data }: RulesState) => {
        this.rules = data?.filter((rule) => !rule.default) || []
    }

    private handleAddRule() {
        this.addingRule = true
    }

    private handleEditRule(event: CustomEvent) {
        this.editingRuleId = event.detail.ruleId
    }

    private handleSaveRule(event: CustomEvent) {
        if (this.editingRuleId) {
            updateRule(event.detail.rule)
        } else {
            addRule(event.detail.rule)
        }

        this.addingRule = false
        this.editingRuleId = undefined
    }

    private handleCancelEdit() {
        // TODO: confirm cancel
        this.editingRuleId = undefined
        this.addingRule = false
    }

    private handleDeleteRule(event: CustomEvent) {
        // TODO: confirm delete
        deleteRule(event.detail.ruleId)

        this.editingRuleId = undefined
    }

    private handleMoveRule(
        event: CustomEvent<{ ruleId: string; direction: -1 | 1 }>,
    ) {
        moveRule(event.detail.ruleId, event.detail.direction)
    }

    private renderRuleForm() {
        const rule =
            this.rules?.find((rule) => rule.id === this.editingRuleId) ||
            DEFAULT_RULE

        return html`<tc-advanced-rule-form
            .defaultRule=${rule}
            .projects=${this.projects}
            @save=${this.handleSaveRule}
            @cancel=${this.handleCancelEdit}
            @delete=${this.handleDeleteRule}
        ></tc-advanced-rule-form>`
    }

    private renderRulesList() {
        if (!this.rules?.length) {
            return html`<div class="empty-state">
                <strong>No rules yet</strong>
                <tc-text small secondary
                    >Your default settings apply to every page.</tc-text
                >
            </div>`
        }

        return html`<tc-text small secondary
                >The first matching rule wins. Order matters.</tc-text
            >
            <tc-advanced-rules-list
                .rules=${this.rules}
                .projects=${this.projects}
                @editRule=${this.handleEditRule}
                @moveRule=${this.handleMoveRule}
            ></tc-advanced-rules-list>
            <tc-text small secondary
                >Matching rules use their own project, labels and due date. AI
                project guessing is skipped.</tc-text
            >`
    }

    render() {
        return html`<tc-section
            title="Advanced rules"
            description="Set different task details for matching URLs."
        >
            ${
                this.editingRuleId || this.addingRule
                    ? nothing
                    : html`<tc-button
                          slot="action"
                          small
                          @click=${this.handleAddRule}
                          >Add rule</tc-button
                      >`
            }
            ${
                this.editingRuleId || this.addingRule
                    ? this.renderRuleForm()
                    : this.renderRulesList()
            }
        </tc-section>`
    }
}
