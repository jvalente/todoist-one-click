import { LitElement, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import Rules from '../../models/rules'

import type { Rule, RulesState } from '../../types/rules.types'

import './advanced-rules'
import './due-date'
import './failed-tasks'
import './reset'
import './target-labels'
import './target-project'

@customElement('tc-settings-data')
class SettingsDataElement extends LitElement {
    @property({ type: String })
    apiKey!: string

    @state()
    private defaultRule?: Rule

    connectedCallback() {
        super.connectedCallback()

        Rules.attach(this.onRulesUpdate)
        Rules.hydrate()
    }

    private onRulesUpdate = ({ data }: RulesState) => {
        this.defaultRule = data?.find((rule) => rule.default)
    }

    // TODO: Move into separate component
    private renderDefaultRule() {
        return html`<tc-project-section 
                .rule=${this.defaultRule}
            ></tc-project-section
            ><tc-target-labels
                .labels=${this.defaultRule?.labels}
            ></tc-target-labels
            ><tc-due-date .dueDate=${this.defaultRule?.dueDate} />`
    }

    render() {
        if (this.defaultRule) {
            return html`
                ${renderFailedTasks()}
                ${this.renderDefaultRule()}${renderAdvancedRules()}${renderReset()}
            `
        }

        return html`<tc-loading />`
    }
}

function renderFailedTasks() {
    return html`<tc-failed-tasks />`
}

function renderAdvancedRules() {
    return nothing
    // return html`<tc-advanced-rules />`
}

function renderReset() {
    return html`<tc-reset />`
}
