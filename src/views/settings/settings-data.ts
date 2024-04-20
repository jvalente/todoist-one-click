import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import './settings-error'
import './target-project'
import './target-labels'
import './failed-tasks'
import './due-date'
import './loading'

import Projects, { ProjectState } from '../../models/projects'
import { settingsSection } from '../common/styles/section'

@customElement('tc-settings-data')
export class SettingsDataElement extends LitElement {
    static styles = [settingsSection]

    @property()
    apiKey?: string

    @state()
    projects: ProjectState['data'] = []

    @state()
    error: ProjectState['error'] = undefined

    @state()
    projectsLastUpdated?: ProjectState['lastUpdated'] = 0

    connectedCallback() {
        super.connectedCallback()

        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()
    }

    private onProjectsUpdate = ({ data, lastUpdated, error }: any) => {
        this.projects = data
        this.projectsLastUpdated = lastUpdated
        this.error = error
    }

    private renderTargetProject() {
        return html`<tc-target-project
            .projects=${this.projects}
            .lastUpdated=${this.projectsLastUpdated}
        ></tc-target-project>`
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
                ${renderFailedTasks()} ${this.renderTargetProject()}
                ${renderTargetLabels()} ${renderDueDate()} ${renderReset()}
            `
        }

        return html`<tc-loading></tc-loading>`
    }
}

function renderFailedTasks() {
    return html`<tc-failed-tasks></tc-failed-tasks>`
}

function renderTargetLabels() {
    return html`<tc-target-labels></tc-target-labels>`
}

function renderDueDate() {
    return html`<tc-due-date></tc-due-date>`
}

function renderReset() {
    return html`<tc-reset></tc-reset>`
}
