import { html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import Projects from '../../models/projects'
import { settingsSection } from './styles/section'
import TargetLabels from '../../models/target-labels'

@customElement('tc-target-labels')
export class TargetLabelsElement extends LitElement {
    static styles = [settingsSection]

    @property({ type: Array })
    targetLabels: Array<string> = []

    @query('#targetLabel')
    targetLabelInput?: HTMLInputElement

    connectedCallback() {
        super.connectedCallback()

        TargetLabels.get().then(this.onTargetLabelsUpdate)
        TargetLabels.addChangeListener(this.onTargetLabelsUpdate)
    }

    private onTargetLabelsUpdate = (targetLabels?: string[]) => {
        this.targetLabels = targetLabels || []
    }

    private handleOnAddClick(event: KeyboardEvent) {
        event.preventDefault()

        const value = (this.targetLabelInput?.value || '').trim()

        if (value && !this.targetLabels.includes(value)) {
            TargetLabels.set([...this.targetLabels, value])
        }
    }

    private handleOnRemoveClick(event: Event, label: string) {
        event.preventDefault()

        TargetLabels.set(this.targetLabels.filter((l) => l !== label))
    }

    render() {
        return html`<section>
            <label>Target Labels</label>
            <ul>
                ${repeat(
                    this.targetLabels,
                    (label) => label,
                    (label) =>
                        html`<li>
                            ${label} (<a
                                href=""
                                @click=${(event: Event) =>
                                    this.handleOnRemoveClick(event, label)}
                                >remove</a
                            >)
                        </li>`
                )}
            </ul>
            <input id="targetLabel" type="text" />
            <button @click=${this.handleOnAddClick}>Add label</button>
        </section>`
    }
}
