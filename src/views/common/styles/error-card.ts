import { css } from 'lit'

export const errorCard = css`
    :host > div {
        margin-bottom: 10px;
        padding: 5px;
        background-color: var(--bg-color-4);
        border-radius: var(--default-border-radius);
    }

    header {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
