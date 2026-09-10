import { css } from 'lit'

export const fieldStyles = css`
    :host {
        display: block;
    }

    .heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 6px 16px;
        margin-bottom: 9px;
    }

    label {
        font-size: 0.875rem;
        font-weight: 600;
    }

    :host([small]) .heading {
        margin-bottom: 6px;
        font-size: 0.875rem;
    }

    .help {
        color: var(--secondary-color);
    }

    ::slotted([slot='help']) {
        display: block;
        margin-top: 10px;
        font-size: 0.75rem;
        line-height: 1.65;
    }
`
