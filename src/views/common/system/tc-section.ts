import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { settingsSection } from '../styles/section'

@customElement('tc-section')
class SectionElement extends LitElement {
    static styles = [settingsSection]

    @property()
    title!: string

    render() {
        return html`<section>
            <h1>${this.title}</h1>
            <slot></slot>
        </section>`
    }
}
