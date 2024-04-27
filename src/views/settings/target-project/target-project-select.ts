import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import type { SelectChangeEvent } from '../../common/system'

import '../../common/system'

@customElement('tc-project-select')
class ProjectSelectElement extends LitElement {
    @property({ type: Boolean })
    small = false

    @property({ type: Object })
    rule?: Rule

    @property({ type: Array })
    projects: ProjectsState['data'] = []

    private handleSelectionChange(event: SelectChangeEvent) {
        const customEvent = new CustomEvent('change', {
            detail: { projectId: event.selectedValue },
        })

        this.dispatchEvent(customEvent)
    }

    get selectedProjectId() {
        return (
            this.rule?.projectId ||
            this.projects?.find((project) => project.is_inbox_project)?.id ||
            ''
        )
    }

    get projectSelectOptions() {
        return this.projects?.map((project) => [project.id, project.name]) || []
    }

    render() {
        return html`<tc-select
            ?small=${this.small}
            .selectedValue=${this.selectedProjectId}
            .options=${this.projectSelectOptions}
            @change=${this.handleSelectionChange}
        />`
    }
}
