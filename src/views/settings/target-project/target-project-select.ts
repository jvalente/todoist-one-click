import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'
import type { SelectChangeEvent } from '../../common/system'

import '../../common/system'

@customElement('tc-project-select')
export class ProjectSelectElement extends LitElement {
    static styles = css`
        time {
            text-align: right;
        }
    `

    @property({ type: Boolean })
    small = false

    @property({ type: String })
    label = ''

    @property({ type: Number })
    lastUpdated?: number

    @property({ type: Boolean })
    refreshing = false

    @property({ type: Object })
    rule?: Partial<Rule>

    @property({ type: Array })
    projects: ProjectsState['data'] = { results: [] }

    private timestampTimer?: ReturnType<typeof setInterval>

    connectedCallback() {
        super.connectedCallback()
        this.timestampTimer = setInterval(() => {
            if (this.lastUpdated) this.requestUpdate()
        }, 60000)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        clearInterval(this.timestampTimer)
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
        >
            ${this.renderProjectUpdates()}
        </tc-select>`
    }

    private renderProjectUpdates() {
        if (!this.lastUpdated) return nothing

        const updated = new Date(this.lastUpdated)

        return html`
            <tc-button
                text
                slot="action"
                ?disabled=${this.refreshing}
                @click=${this.handleRefresh}
                >${this.refreshing ? 'Refreshing…' : 'Refresh projects'}</tc-button
            >
            <time
                slot="help"
                datetime=${updated.toISOString()}
                title=${updated.toLocaleString()}
                >Updated ${this.formatLastUpdated(this.lastUpdated)}</time
            >
        `
    }

    private formatLastUpdated(lastUpdated: number) {
        const minutes = Math.floor((Date.now() - lastUpdated) / 60000)
        if (minutes < 1) return 'just now'

        const relativeTime = new Intl.RelativeTimeFormat('en', {
            numeric: 'always',
        })
        if (minutes < 60) return relativeTime.format(-minutes, 'minute')
        if (minutes < 1440) {
            return relativeTime.format(-Math.floor(minutes / 60), 'hour')
        }
        return relativeTime.format(-Math.floor(minutes / 1440), 'day')
    }

    private handleSelectionChange(event: SelectChangeEvent) {
        const customEvent = new CustomEvent('change', {
            detail: { projectId: event.selectedValue },
        })

        this.dispatchEvent(customEvent)
    }

    private handleRefresh() {
        this.dispatchEvent(new CustomEvent('refresh'))
    }
}
