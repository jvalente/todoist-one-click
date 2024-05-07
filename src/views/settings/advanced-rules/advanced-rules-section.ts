import { LitElement, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { addRule, deleteRule, updateRule } from '../../../controllers/rules'
import Projects from '../../../models/projects'
import Rules from '../../../models/rules'

import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

import '../../common/system'
import './advanced-rule-form'
import './advanced-rules-list'

const DEFAULT_RULE = { matchMode: 'contains' }

@customElement('tc-advanced-rules-section')
class AdvancedRulesSectionElement extends LitElement {
    @state()
    private rules: RulesState['data'] = []

    @state()
    private projects: ProjectsState['data'] = []

    @state()
    private editingRuleId?: string

    @state()
    private addingRule = false

    connectedCallback() {
        super.connectedCallback()

        Rules.attach(this.onRulesUpdate)
        Rules.hydrate()

        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()
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
        const { rule } = event.detail

        if (this.editingRuleId) {
            updateRule(event.detail.rule)
        } else {
            addRule(event.detail.rule)
        }

        this.addingRule = false
        this.editingRuleId = undefined
    }

    private handleCancelEdit(event: CustomEvent) {
        // TODO: confirm cancel
        this.editingRuleId = undefined
        this.addingRule = false
    }

    private handleDeleteRule(event: CustomEvent) {
        // TODO: confirm delete
        deleteRule(event.detail.ruleId)

        this.editingRuleId = undefined
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
        return html`${
            this.rules?.length
                ? html`<tc-advanced-rules-list
                      .rules=${this.rules}
                      .projects=${this.projects}
                      @editRule=${this.handleEditRule}
                  ></tc-advanced-rules-list>`
                : nothing
        }<tc-link @click=${this.handleAddRule}
                >Add rule</tc-link
            >`
    }

    render() {
        return html`<tc-section title="Advanced rules">
            ${
                this.editingRuleId || this.addingRule
                    ? this.renderRuleForm()
                    : this.renderRulesList()
            }
        </tc-section>`
    }
}
