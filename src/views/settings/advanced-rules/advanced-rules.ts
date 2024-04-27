import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import '../../common/system'

@customElement('tc-advanced-rules')
class AdvancedRulesElement extends LitElement {
    static styles = [
        css`
            div {
                display: flex;
                align-items: center;
            }
        `,
    ]

    render() {
        return html`<tc-section title="Advanced rules">
            <div>
                <tc-text>If the tab url</tc-text>
                <tc-select
                    small
                    .options=${['contains', 'is exactly', 'matches regex']}
                    .selectedValue=${'contains'}
                    @change=${() => {}}
                ></tc-select>
                <tc-text-input small placeholder="url"></tc-text-input>
            </div>
            <div>
                then
            </div>
        </tc-section>`
    }
}
