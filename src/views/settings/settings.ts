import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TodoistAPIKey } from '../../api/todoist'

import '../common/system'
import './api-key'
import './settings-data'

@customElement('tc-settings')
export class SettingsElement extends LitElement {
    @state()
    apiKey?: string

    private unsubscribe?: () => void

    connectedCallback() {
        super.connectedCallback()

        this.unsubscribe = TodoistAPIKey.attach(this.onApiKeyUpdate)
        TodoistAPIKey.get().then(this.onApiKeyUpdate)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.unsubscribe?.()
    }

    private onApiKeyUpdate = (apiKey?: string) => {
        this.apiKey = apiKey
    }

    render() {
        return this.apiKey ? html`<tc-settings-data />` : html`<tc-api-key />`
    }
}
