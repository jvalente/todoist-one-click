import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { settingsSection } from '../styles/section'

@customElement('tc-section')
export class SectionElement extends LitElement {
    static styles = [settingsSection]

    @property()
    title!: string

    render() {
        return html`<section>
            <h2>${this.title}</h2>
            <slot></slot>
        </section>`
    }
}
