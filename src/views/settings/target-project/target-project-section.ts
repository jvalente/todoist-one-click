import { html, LitElement } from 'lit'
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
class ProjectSectionElement extends LitElement {
    @property({ type: Object })
    rule?: Rule

    @state()
    private projects: ProjectsState['data'] = []

    @state()
    private lastUpdated?: ProjectsState['lastUpdated']

    @state()
    private error?: ProjectsState['error']

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
        this.projects = data
        this.lastUpdated = lastUpdated
        this.error = error
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
        Projects.delete()

        // TODO: improve this (model API)
        setTimeout(() => Projects.hydrate(), 200)
    }

    private formatedDate() {
        return this.lastUpdated
            ? new Date(this.lastUpdated).toLocaleString()
            : 'never'
    }

    private renderIntroText() {
        return this.guessProjectEnabled === true
            ? html`<tc-text small secondary
                  >AI will attempt to guess the project based on the webpage
                  title and URL.</tc-text
              >`
            : html`<tc-text small secondary
                  >Tasks will be added to the selected project below.</tc-text
              >`
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
            <div>
                ${this.renderIntroText()}
                <tc-text small secondary
                    >The project list was last updated on
                    ${this.formatedDate()}.
                    <tc-link @click=${this.refreshProjects}>Refresh</tc-link>
                </tc-text>
            </div>
            <tc-project-select
                .rule=${this.rule}
                .projects=${this.projects}
                @change=${this.handleProjectSelectChange}
            ></tc-project-select>
            <tc-project-guess
                .checked="${this.guessProjectEnabled}"
                @change=${this.onGuessProjectOptionChange}
            ></tc-project-guess>
        `
    }

    render() {
        return html`<tc-section title="Target project">
            ${this.renderSectionContent()}
        </tc-section>`
    }
}
