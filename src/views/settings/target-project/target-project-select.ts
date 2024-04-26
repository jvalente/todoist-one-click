import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { updateDefaultRule } from '../../../controllers/rules'

import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import type { SelectChangeEvent } from '../../common/system'

import '../../common/system'

@customElement('tc-project-select')
class ProjectSelectElement extends LitElement {
    @property({ type: Object })
    rule?: Rule

    @property({ type: Array })
    projects: ProjectsState['data'] = []

    private handleSelectionChange(event: SelectChangeEvent) {
        updateDefaultRule({ projectId: event.selectedValue })
    }

    get selectedProjectId() {
        return this.rule?.projectId || ''
    }

    get projectSelectOptions() {
        return this.projects?.map((project) => [project.id, project.name]) || []
    }

    render() {
        return html`<tc-select
            .selectedValue=${this.selectedProjectId}
            .options=${this.projectSelectOptions}
            @change=${this.handleSelectionChange}
        />`
    }
}
