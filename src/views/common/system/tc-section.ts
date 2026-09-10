import { html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { settingsSection } from '../styles/section'

@customElement('tc-section')
export class SectionElement extends LitElement {
    static styles = [settingsSection]

    @property()
    title!: string

    @property()
    description = ''

    render() {
        return html`<section>
            <header>
                <h2>${this.title}</h2>
                ${this.description ? html`<p>${this.description}</p>` : nothing}
            </header>
            <slot></slot>
        </section>`
    }
}
