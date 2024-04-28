import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'

import '../../common/system'

@customElement('tc-advanced-rule')
class AdvancedRuleElement extends LitElement {
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
        return html`<p>
            ${this.rule.matchMode}: ${this.rule.query} - ${this.projectName}
            <tc-link @click=${this.handleEditRule}>Edit</tc-link>
        </p>`
    }
}
