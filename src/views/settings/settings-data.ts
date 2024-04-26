import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import './due-date'
import './failed-tasks'
import './loading'
import './reset'
import './target-labels'
import './target-project'

import Rules from '../../models/rules'
import type { Rule, RulesState } from '../../types/rules.types'

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
            ><tc-due-date .dueDate=${this.defaultRule?.dueDate}></tc-due-date>`
    }

    render() {
        if (this.defaultRule) {
            return html`
                ${renderFailedTasks()}
                ${this.renderDefaultRule()}${renderReset()}
            `
        }

        return html`<tc-loading></tc-loading>`
    }
}

function renderFailedTasks() {
    return html`<tc-failed-tasks></tc-failed-tasks>`
}

function renderReset() {
    return html`<tc-reset></tc-reset>`
}
