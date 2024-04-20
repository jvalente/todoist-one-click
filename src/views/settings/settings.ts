import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TodoistAPIKey } from '../../api/todoist'

import './api-key'
import './settings-data'
import '../common/system'

@customElement('tc-settings')
export class SettingsElement extends LitElement {
    @state()
    apiKey?: string

    connectedCallback() {
        super.connectedCallback()

        TodoistAPIKey.attach(this.onApiKeyUpdate)
        TodoistAPIKey.get().then(this.onApiKeyUpdate)
    }

    private onApiKeyUpdate = (apiKey?: string) => {
        this.apiKey = apiKey
    }

    private renderApiKey() {
        return html`<tc-api-key .apiKey=${this.apiKey}></tc-api-key>`
    }

    private renderSettingsData() {
        return html`<tc-settings-data
            .apiKey=${this.apiKey}
        ></tc-settings-data>`
    }

    render() {
        if (!this.apiKey) {
            return html`${this.renderApiKey()}`
        } else {
            return html`${this.renderSettingsData()}`
        }
    }
}
