import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { settingsSection } from '../common/styles/section'
import TargetProjectId from '../../models/target-project-id'
import { setTargetProjectId } from '../../controllers/target-project-id'
import Projects from '../../models/projects'
import type { Project, ProjectsState } from '../../types/projects.types'

@customElement('tc-target-project')
export class TargetProjectElement extends LitElement {
    static styles = [settingsSection]

    @property({ type: Array })
    projects: ProjectsState['data'] = []

    @property({ type: Number })
    lastUpdated: ProjectsState['lastUpdated']

    @state()
    private targetProjectId?: string

    connectedCallback() {
        super.connectedCallback()

        TargetProjectId.attach(this.onTargetProjectIdUpdate)
        TargetProjectId.hydrate()
    }

    private onTargetProjectIdUpdate = ({ data }: { data?: string }) => {
        this.targetProjectId = data
    }

    // TODO: find type solution
    private handleSelectionChange(event: any) {
        setTargetProjectId(event.target.value)
    }

    private isSelected(project: Project) {
        return (
            project.id === this.targetProjectId ||
            (!this.targetProjectId && project.is_inbox_project)
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
        return html`<section>
            <label>Target project</label>
            <div>
                <small
                    >Tasks will be added to the selected project below.</small
                >
                <small
                    >The project list was last updated on
                    ${this.formatedDate()}.
                    <tc-al @click=${this.refreshProjects}>Refresh</tc-al>
                </small>
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
        </section>`
    }
}
