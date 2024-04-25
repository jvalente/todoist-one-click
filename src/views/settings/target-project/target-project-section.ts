import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import Projects from '../../../models/projects'
import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

@customElement('tc-project-section')
export class ProjectSectionElement extends LitElement {
    @property({ type: Object })
    rule?: RulesState['data']

    @state()
    private projects: ProjectsState['data'] = []

    @state()
    private projectsLastUpdated?: ProjectsState['lastUpdated'] = 0

    connectedCallback() {
        super.connectedCallback()

        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()
    }

    private onProjectsUpdate = ({ data, lastUpdated }: ProjectsState) => {
        this.projects = data
        this.projectsLastUpdated = lastUpdated
    }

    private refreshProjects() {
        Projects.delete()

        // TODO: improve this (model API)
        setTimeout(() => Projects.hydrate(), 200)
    }

    private formatedDate() {
        return this.projectsLastUpdated
            ? new Date(this.projectsLastUpdated).toLocaleString()
            : 'never'
    }

    render() {
        return html`<tc-section title="Target project">
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
