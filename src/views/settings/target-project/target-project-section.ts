import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { updateDefaultRule } from '../../../controllers/rules'
import Projects from '../../../models/projects'
import type { ProjectsState } from '../../../types/projects.types'
import type { Rule } from '../../../types/rules.types'

import '../../common/system'
import './target-project-select'
import './target-project-guess'
import { setGuessProjectOption } from '../../../controllers/guess-project-option'
import { GuessProjectOption } from '../../../models/guess-project-option'

@customElement('tc-project-section')
export class ProjectSectionElement extends LitElement {
    static styles = css`
        tc-project-select {
            margin-bottom: 24px;
        }
    `

    @property({ type: Object })
    rule?: Rule

    @state()
    private projects: ProjectsState['data'] = { results: [] }

    @state()
    private lastUpdated?: ProjectsState['lastUpdated']

    @state()
    private error?: ProjectsState['error']

    @state()
    private refreshing = false

    @state()
    private guessProjectEnabled = false

    connectedCallback() {
        super.connectedCallback()

        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()

        // TODO: find DRY solution
        GuessProjectOption.attach((checked) => {
            this.guessProjectEnabled = checked === true
        })
        GuessProjectOption.get().then((checked) => {
            this.guessProjectEnabled = checked === true
        })
    }

    private onProjectsUpdate = ({
        data,
        lastUpdated,
        error,
    }: ProjectsState) => {
        if (this.refreshing && !data && !error) return

        this.projects = data || { results: [] }
        this.lastUpdated = lastUpdated
        this.error = error
        this.refreshing = false
    }

    private onGuessProjectOptionChange = (event: CustomEvent) => {
        const { checked } = event.detail
        setGuessProjectOption(checked)
    }

    private handleProjectSelectChange(event: CustomEvent) {
        const { projectId } = event.detail
        updateDefaultRule({ projectId })
    }

    private refreshProjects() {
        if (this.refreshing) return
        this.refreshing = true
        Projects.delete()

        // TODO: improve this (model API)
        setTimeout(() => Projects.hydrate(), 200)
    }

    private get fallbackProjectName() {
        return this.projects?.results.find((project) =>
            this.rule?.projectId
                ? project.id === this.rule.projectId
                : project.is_inbox_project,
        )?.name
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
            <tc-project-select
                label="Default project"
                .rule=${this.rule}
                .projects=${this.projects}
                .lastUpdated=${this.lastUpdated}
                .refreshing=${this.refreshing}
                @change=${this.handleProjectSelectChange}
                @refresh=${this.refreshProjects}
            ></tc-project-select>
            <tc-project-guess
                .checked="${this.guessProjectEnabled}"
                .fallbackProject=${this.fallbackProjectName}
                @change=${this.onGuessProjectOptionChange}
            ></tc-project-guess>
        `
    }

    render() {
        return html`<tc-section
            title="Target project"
            description="Choose where new tasks go by default."
        >
            ${this.renderSectionContent()}
        </tc-section>`
    }
}
