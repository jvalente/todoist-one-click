import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { updateDefaultRule } from '../../../controllers/rules'
import Projects from '../../../models/projects'

import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'

import '../../common/system'
import './target-project-select'

@customElement('tc-project-section')
class ProjectSectionElement extends LitElement {
    @property({ type: Object })
    rule?: Rule

    @state()
    private projects: ProjectsState['data'] = []

    @state()
    private lastUpdated?: ProjectsState['lastUpdated']

    @state()
    private error?: ProjectsState['error']

    connectedCallback() {
        super.connectedCallback()

        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()
    }

    private onProjectsUpdate = ({
        data,
        lastUpdated,
        error,
    }: ProjectsState) => {
        this.projects = data
        this.lastUpdated = lastUpdated
        this.error = error
    }

    private handleProjectSelectChange(event: CustomEvent) {
        const { projectId } = event.detail
        updateDefaultRule({ projectId })
    }

    private refreshProjects() {
        Projects.delete()

        // TODO: improve this (model API)
        setTimeout(() => Projects.hydrate(), 200)
    }

    private formatedDate() {
        return this.lastUpdated
            ? new Date(this.lastUpdated).toLocaleString()
            : 'never'
    }

    private renderSectionContent() {
        if (this.error) {
            return html`<tc-error-card
                title="Error while loading projects"
                .error=${this.error}
            ></tc-error-card>`
        }

        if (!this.lastUpdated && !this.error) {
            return html`<tc-loading description="Loading projects" />`
        }

        return html`
            <div>
                <tc-text small secondary
                    >Tasks will be added to the selected project below.</tc-text
                >
                <tc-text small secondary
                    >The project list was last updated on
                    ${this.formatedDate()}.
                    <tc-link @click=${this.refreshProjects}>Refresh</tc-link>
                </tc-text>
            </div>
            <tc-project-select
                .rule=${this.rule}
                .projects=${this.projects}
                @change=${this.handleProjectSelectChange}
            ></tc-project-select>
        `
    }

    render() {
        return html`<tc-section title="Target project">
            ${this.renderSectionContent()}
        </tc-section>`
    }
}
