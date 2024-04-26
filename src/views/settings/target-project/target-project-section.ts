import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import Projects from '../../../models/projects'
import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

@customElement('tc-project-section')
class ProjectSectionElement extends LitElement {
    @property({ type: Object })
    rule?: RulesState['data']

    @state()
    private projects: ProjectsState['data'] = []

    @state()
    private lastUpdated?: ProjectsState['lastUpdated'] = 0

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

    render() {
        return html`<tc-section title="Target project">
            <tc-error-card
                title="Error while loading projects"
                .error=${this.error}
            ></tc-error-card>
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
            ></tc-project-select>
        </tc-section>`
    }
}
