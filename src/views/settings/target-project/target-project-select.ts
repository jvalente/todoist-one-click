import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { updateDefaultRule } from '../../../controllers/rules'

import type { Project, ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import { settingsSelect } from '../../common/styles/select'

@customElement('tc-project-select')
class ProjectSelectElement extends LitElement {
    static styles = [settingsSelect]

    @property({ type: Object })
    private rule?: Rule

    @property()
    private projects: ProjectsState['data'] = []

    // TODO: find type solution
    private handleSelectionChange(event: any) {
        updateDefaultRule({ projectId: event.target.value })
    }

    private isSelected(project: Project) {
        return (
            project.id === this.rule?.projectId ||
            (!this.rule?.projectId && project.is_inbox_project)
        )
    }

    render() {
        return html`<select id="dropdown" @change=${this.handleSelectionChange}>
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
        </select>`
    }
}
