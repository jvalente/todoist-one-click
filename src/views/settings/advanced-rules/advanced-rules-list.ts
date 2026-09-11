import { css, html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

import '../../common/system'
import './advanced-rule'

@customElement('tc-advanced-rules-list')
export class AdvancedRulesListElement extends LitElement {
    static styles = css`
        ol {
            display: grid;
            gap: 8px;
            margin: 0;
            padding: 0;
            list-style: none;
        }
    `

    @property({ type: Array })
    rules?: RulesState['data'] = []

    @property({ type: Array })
    projects?: ProjectsState['data'] = { results: [] }

    render() {
        if (!this.rules?.length) return nothing

        const rules = this.rules

        return html`<ol aria-label="Rules in priority order">
            ${repeat(
                rules,
                (rule) => rule.id,
                (rule, index) =>
                    html`<li>
                    <tc-advanced-rule
                    .rule=${rule}
                    .projects=${this.projects}
                    .position=${index}
                    ?isFirst=${index === 0}
                    ?isLast=${index === rules.length - 1}
                    ></tc-advanced-rule>
                </li>`,
            )}
        </ol>`
    }
}
