import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import './settings-error'
import './target-project'

import Projects from '../../models/projects'
import { settingsSection } from './styles/section'

@customElement('tc-settings-data')
export class SettingsDataElement extends LitElement {
    static styles = [settingsSection]

    @property()
    apiKey?: string

    @property()
    projects: any = []

    @property()
    error: any = undefined

    @property()
    lastUpdated?: number = 0

    connectedCallback() {
        super.connectedCallback()

        Projects.attach(this.onProjectsUpdate)
        Projects.hydrate()
    }

    private onProjectsUpdate = ({ data, lastUpdated, error }: any) => {
        this.projects = data
        this.lastUpdated = lastUpdated
        this.error = error
    }

    private renderTargetProject() {
        return html`<tc-target-project
            .projects=${this.projects}
            .lastUpdated=${this.lastUpdated}
        ></tc-target-project>`
    }

    private renderReset() {
        return html`<tc-reset></tc-reset>`
    }

    render() {
        if (this.error) {
            return html`<tc-settings-error
                    .error=${this.error}
                ></tc-settings-error
                >${this.renderReset()}`
        }

        if (this.projects) {
            return html`${this.renderTargetProject()}${this.renderReset()}`
        }

        return html`<p>Loading...</p>`
    }
}