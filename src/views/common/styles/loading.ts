import { css } from 'lit'

/**
 * https://css-loaders.com/dots/#l37
 */

export const loading = css`
    .loader {
        margin: 50px auto;
        color: var(--secondary-color);
        width: 6px;
        aspect-ratio: 1;
        border-radius: 50%;
        animation: l37-1 0.75s infinite linear alternate,
            l37-2 1.5s infinite linear;
    }
    @keyframes l37-1 {
        0%,
        20% {
            box-shadow: 30px 0 0 3px, 10px 0 0 3px, -10px 0 0 3px, -30px 0 0 3px;
        }
        60%,
        100% {
            box-shadow: 12px 0 0 3px, 14px 0 0 6px, -14px 0 0 6px, -12px 0 0 3px;
        }
    }

    @keyframes l37-2 {
        0%,
        25% {
            transform: rotate(0);
        }
        50%,
        100% {
            transform: rotate(0.5turn);
        }
    }
`
