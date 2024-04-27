import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import Projects from '../../../models/projects'
import Rules from '../../../models/rules'

import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

import '../../common/system'
import './advanced-rule'

@customElement('tc-advanced-rules-section')
class AdvancedRulesSectionElement extends LitElement {
    @state()
    private rules: RulesState['data'] = []

    @state()
    private projects: ProjectsState['data'] = []

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

    render() {
        return html`<tc-section title="Advanced rules">
           <tc-advanced-rule .projects=${this.projects}></tc-advanced-rule>
        </tc-section>`
    }
}
