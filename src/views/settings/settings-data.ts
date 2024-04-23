import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import './settings-error'
import './target-project'
import './target-labels'
import './failed-tasks'
import './due-date'
import './loading'

import Projects from '../../models/projects'
import { settingsSection } from '../common/styles/section'
import type { ProjectsState } from '../../types/projects.types'
import { Rule, RulesState } from '../../types/rules.types'
import Rules from '../../models/rules'

@customElement('tc-settings-data')
export class SettingsDataElement extends LitElement {
    static styles = [settingsSection]

    @property({ type: String })
    apiKey!: string

    @state()
    private projects: ProjectsState['data'] = []

    @state()
    private error: ProjectsState['error'] = undefined

    @state()
    private projectsLastUpdated?: ProjectsState['lastUpdated'] = 0

    @state()
    private defaultRule?: Rule

    connectedCallback() {
        super.connectedCallback()

        Rules.attach(this.onRulesUpdate)
        Rules.hydrate()
        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()
    }

    private onProjectsUpdate = ({
        data,
        lastUpdated,
        error,
    }: ProjectsState) => {
        this.projects = data
        this.projectsLastUpdated = lastUpdated
        this.error = error
    }

    private onRulesUpdate = ({ data }: RulesState) => {
        this.defaultRule = data?.find((rule) => rule.default)
    }

    // TODO: Move into separate component
    private renderDefaultRule() {
        return html`<tc-target-project
                .projectId=${this.defaultRule?.projectId}
                .projects=${this.projects}
                .lastUpdated=${this.projectsLastUpdated}
            ></tc-target-project
            ><tc-target-labels
                .labels=${this.defaultRule?.labels}
            ></tc-target-labels
            ><tc-due-date .dueDate=${this.defaultRule?.dueDate}></tc-due-date>`
    }

    render() {
        if (this.error) {
            return html`<tc-settings-error
                    .error=${this.error}
                ></tc-settings-error
                >${renderReset()}`
        }

        if (this.projects && this.projectsLastUpdated) {
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
