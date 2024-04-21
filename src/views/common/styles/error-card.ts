import { css } from 'lit'

export const errorCard = css`
    :host > div {
        margin-bottom: 10px;
        padding: 5px;
        background-color: var(--bg-color-error);
        border-radius: var(--default-border-radius);
    }

    :host > div > small:first-child {
        font-weight: bold;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host > div > small:nth-child(2) {
        font-style: italic;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host > div > small:nth-child(2) > a {
        color: var(--accent-color-0);
    }

    :host > div > small:nth-child(3) {
        margin: 20px 0;
        display: block;
        color: var(--secondary-color);
    }
`
