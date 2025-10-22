import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { SelectChangeEvent } from './events'

@customElement('tc-select')
export class SelectElement extends LitElement {
    static styles = css`
        select {
            width: 100%;
            border: none;
            border-radius: var(--default-border-radius);
            padding: 10px;
            color: var(--primary-color);
            font-size: var(--global-font-size);
            background-color: var(--bg-color-3);
            border-right: 8px solid transparent;
        }

        :host([small]) select {
            font-size: var(--small-font-size);
            padding: 4px 2px;
            border-right: 4px solid transparent;
        }
    `
    @property({ type: Boolean })
    small = false

    @property({ type: Array })
    options: Array<string | string[]> = []

    @property({ type: String })
    selectedValue = ''

    handleEvent(event: Event) {
        event.preventDefault()

        const customEvent = new SelectChangeEvent(
            (event.target as HTMLSelectElement).value,
        )

        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<select @change=${this.handleEvent}>
            <option value="" disabled selected>Select your option</option>
            ${repeat(
                this.options,
                (option) => getOptionValue(option),
                (option) =>
                    html`<option
                        value=${getOptionValue(option)}
                        ?selected=${
                            getOptionValue(option) === this.selectedValue
                        }
                    >
                        ${getOptionContent(option)}
                    </option>`,
            )}
        </select>`
    }
}

function getOptionValue(option: string | string[]) {
    return Array.isArray(option) ? option[0] : option
}

function getOptionContent(option: string | string[]) {
    return Array.isArray(option) ? option[1] : option
}
