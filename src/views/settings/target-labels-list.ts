import { LitElement, html } from 'lit'
import { settingsSection } from '../common/styles/section'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { horizontalList } from '../common/styles/horizontal-list'

import { deleteIcon } from '../common/svg/delete'

@customElement('tc-target-labels-list')
export class TargetLabelsListElement extends LitElement {
    static styles = [settingsSection, horizontalList]

    @property()
    labels: Array<string> = []

    @property()
    onRemove = (label: string) => undefined

    private handleOnRemove(event: PointerEvent, label: string) {
        event.preventDefault()
        this.onRemove(label)
    }

    render() {
        return html`<ul>
            ${repeat(
                this.labels,
                (label) => label,
                (label) =>
                    html`<li>
                        ${label}<a
                            href="#"
                            @click=${(event: PointerEvent) =>
                                this.handleOnRemove(event, label)}
                            >${deleteIcon}</a
                        >
                    </li>`
            )}
        </ul>`
    }
}
