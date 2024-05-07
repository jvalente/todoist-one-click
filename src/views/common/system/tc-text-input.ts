import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { InputChangeEvent, InputEnterPressEvent } from './events'

@customElement('tc-text-input')
class TextInputElement extends LitElement {
    static styles = css`
        input {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: var(--default-border-radius);
            color: var(--primary-color);
            font-size: var(--global-font-size);
            background-color: var(--bg-color-3);
        }

        :host([small]) input {
            font-size: var(--small-font-size);
            padding: 4px 2px;
        }
    `
    @property({ type: Boolean })
    small = false

    @property({ type: String })
    placeholder = ''

    @property({ type: String })
    value = ''

    @property({ type: Boolean })
    disableSpace = false

    @property({ type: Boolean })
    disableEnter = false

    @property({ type: Boolean })
    autofocus = false

    // TODO: handle paste event

    private handleKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter' && !this.disableEnter) {
            this.dispatchEvent(new InputEnterPressEvent(this.value))
            // TODO this should not be here. It should be handled by the parent component
            this.value = ''
        }
    }

    private handleKeydown(event: KeyboardEvent) {
        const { key, code } = event

        if (this.disableSpace && (key === ' ' || code === 'Space')) {
            event.preventDefault()
        }
    }

    private handleInput(event: InputEvent) {
        const { value } = event.target as HTMLInputElement
        this.value = value
        this.dispatchEvent(new InputChangeEvent(value))
    }

    render() {
        return html`<input
            type="text"
            placeholder=${this.placeholder}
            .value=${this.value}
            @input=${this.handleInput}
            @keydown=${this.handleKeydown}
            @keyup=${this.handleKeyup}
            ?autofocus=${this.autofocus}
        />`
    }
}
