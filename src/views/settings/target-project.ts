import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import Projects from '../../models/projects'
import type { Project, ProjectsState } from '../../types/projects.types'
import { updateDefaultRule } from '../../controllers/rules'

@customElement('tc-target-project')
export class TargetProjectElement extends LitElement {
    @property({ type: Array })
    projects: ProjectsState['data'] = []

    @property({ type: Number })
    lastUpdated: ProjectsState['lastUpdated']

    @property()
    private projectId?: string

    // TODO: find type solution
    private handleSelectionChange(event: any) {
        updateDefaultRule({ projectId: event.target.value })
    }

    private isSelected(project: Project) {
        return (
            project.id === this.projectId ||
            (!this.projectId && project.is_inbox_project)
        )
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

            <select id="dropdown" @change=${this.handleSelectionChange}>
                <option value="" disabled selected>Select your option</option>
                ${repeat(
                    this.projects || [],
                    (project) => project.id,
                    (project) =>
                        html`<option
                            value=${project.id}
                            ?selected=${this.isSelected(project)}
                        >
                            ${project.name}
                        </option>`
                )}
            </select>
        </tc-section>`
    }
}
