import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { horizontalList } from '../../common/styles/horizontal-list'

import { deleteIcon } from '../../common/svg/delete'

@customElement('tc-target-labels-list')
class TargetLabelsListElement extends LitElement {
    static styles = [horizontalList]

    @property()
    labels: Array<string> = []

    @property()
    onRemove = (label: string) => undefined

    private handleOnRemove(label: string) {
        this.onRemove(label)
    }

    render() {
        return html`<ul>
            ${repeat(
                this.labels,
                (label) => label,
                (label) =>
                    html`<li>
                        ${label}<tc-al
                            @click=${() => this.handleOnRemove(label)}
                            >${deleteIcon}</tc-al
                        >
                    </li>`
            )}
        </ul>`
    }
}
