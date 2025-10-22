import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import '../../common/system'
import type { CheckboxChangeEvent } from '../../common/system'

@customElement('tc-project-guess')
export class ProjectGuessElement extends LitElement {
    @property({ type: Boolean })
    checked = true

    private handleCheckedToggle(event: CheckboxChangeEvent) {
        const customEvent = new CustomEvent('change', {
            detail: { checked: event.checked },
        })

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<div>
            <tc-checkbox
                name="toggle-guess-project"
                .checked="${this.checked}"
                @change="${this.handleCheckedToggle}"
                >Guess the project
            </tc-checkbox>
            <tc-text small secondary
                >By enabling this option, a list of your project names, the
                webpage title and URL will be sent to the
                <tc-link
                    href="https://help.openai.com/en/collections/6864268-privacy-and-policies"
                    >OpenAI</tc-link
                >
                servers in an attempt to guess the project you are working on.
                This information will be used to suggest the most relevant rules
                for your project.
            </tc-text>
        </div> `
    }
}
