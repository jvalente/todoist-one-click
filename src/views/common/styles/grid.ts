import { css } from 'lit'

export const grid = css`
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .stack {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .spaceBetween {
        justify-content: space-between;
    }
`
