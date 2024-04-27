import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tc-error-card')
class ErrorCardElement extends LitElement {
    static styles = css`
        div {
            padding: 3px 5px;
            background-color: var(--bg-color-error);
            border-radius: var(--default-border-radius);
        }

        h1 {
            margin: 0;
            font-size: 1rem;
            font-weight: medium;
            color: var(--text-color-error);
        }

        code {
            display: block;
            font-size: var(--small-font-size);
        }

        ::slotted([slot='actions']) {
            display: inline-block;
            margin: 5px 10px 0 0;
        }
    `

    @property()
    title = 'Error'

    @property({ type: Object })
    error?: any

    render() {
        if (this.error) {
            return html`<div>
                <h1>${this.title}</h1>
                <tc-text small secondary
                    >${getErrorDescription(this.error)}</tc-text
                >
                <code
                    >${
                        this.error?.status || this.error?.responseText
                            ? html`${this.error?.status} -
                          ${this.error?.responseText}`
                            : html`${this.error?.message}`
                    }</code
                >
                <slot name="actions"></slot>
            </div>`
        }

        return nothing
    }
}

function getErrorDescription(error: any) {
    if (error && error.status === 401) {
        return 'This error usually happens when the API token is invalid or expired. Try to update it using the option below.'
    }

    if (error && error.status >= 500) {
        return 'The Todoist servers may be currently unavailable.'
    }

    if (error && error.status >= 400) {
        return 'This error usually happens when Todoist could not process the request.'
    }

    if (error && !error.status) {
        return 'We were not able to reach the Todoist servers. Please check your internet connection and try again.'
    }

    return 'An unknown error occurred.'
}
