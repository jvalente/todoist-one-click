import { css } from 'lit'

export const horizontalList = css`
    ul {
        display: flex;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;
    }

    ul li {
        display: flex;
        align-items: center;
        gap: 5px;
        margin: 5px 10px;
        padding: 5px;
        background-color: var(--bg-color-4);
        border-radius: var(--default-border-radius);
    }

    ul:first-child li {
        margin-left: 0;
    }

    svg > * {
        fill: var(--accent-color-0);
    }
`
