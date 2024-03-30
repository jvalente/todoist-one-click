import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import './reset'
import { settingsSection } from './styles/section'

@customElement('tc-settings-error')
export class SettingsErrorElement extends LitElement {
    static styles = [settingsSection]

    @property()
    error: any = undefined

    render() {
        if (this.error) {
            return html`<section>
                <label>Something went wrong...</label>
                <p>${this.error?.message}</p>
            </section>`
        }
    }
}
