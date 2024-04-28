import { LitElement, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

import type { ProjectsState } from '../../../types/projects.types'
import type { RulesState } from '../../../types/rules.types'

import '../../common/system'
import './advanced-rule'

@customElement('tc-advanced-rules-list')
class AdvancedRulesListElement extends LitElement {
    @property({ type: Array })
    rules?: RulesState['data'] = []

    @property({ type: Array })
    projects?: ProjectsState['data'] = []

    render() {
        if (!this.rules?.length) return nothing

        return html`${repeat(
            this.rules,
            (rule) => rule.id,
            (rule) =>
                html`<tc-advanced-rule
                    .rule=${rule}
                    .projects=${this.projects}
                ></tc-advanced-rule>`,
        )}`
    }
}
