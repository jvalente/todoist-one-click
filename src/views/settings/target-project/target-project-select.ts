import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import type { SelectChangeEvent } from '../../common/system'

import '../../common/system'

@customElement('tc-project-select')
export class ProjectSelectElement extends LitElement {
    @property({ type: Boolean })
    small = false

    @property({ type: String })
    label = ''

    @property({ type: Object })
    rule?: Partial<Rule>

    @property({ type: Array })
    projects: ProjectsState['data'] = { results: [] }

    private handleSelectionChange(event: SelectChangeEvent) {
        const customEvent = new CustomEvent('change', {
            detail: { projectId: event.selectedValue },
        })

        this.dispatchEvent(customEvent)
    }

    get selectedProjectId() {
        return (
            this.rule?.projectId ||
            this.projects?.results?.find((project) => project.is_inbox_project)
                ?.id ||
            ''
        )
    }

    get projectSelectOptions() {
        return (
            this.projects?.results?.map((project) => [
                project.id,
                project.name,
            ]) || []
        )
    }

    render() {
        return html`<tc-select
            ?small=${this.small}
            .label=${this.label}
            .selectedValue=${this.selectedProjectId}
            .options=${this.projectSelectOptions}
            @change=${this.handleSelectionChange}
        />`
    }
}
