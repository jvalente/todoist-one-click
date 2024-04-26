import { css } from 'lit'

export const settingsSection = css`
    section {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        padding: 10px 20px;
        background-color: var(--bg-color-1);
        border-radius: var(--default-border-radius);
    }

    section h1 {
        font-size: var(--title-font-size);
        font-weight: 600;
        border-bottom: 1px solid var(--bg-color-3);
        margin: 10px 0 5px 0;
    }

    ::slotted(*) {
        margin: 10px 0;
    }

    section ::slotted(input) {
        border: none;
        border-radius: var(--default-border-radius);
        padding: 10px;
        color: var(--primary-color);
        font-size: var(--global-font-size);
        background-color: var(--bg-color-3);
    }

    section ::slotted(button) {
        border: none;
        border-radius: var(--default-border-radius);
        padding: 10px;
        font-size: var(--global-font-size);
        color: var(--primary-color-inverted);
        background-color: var(--accent-color-0);
    }

    section ::slotted(button:hover) {
        background-color: var(--accent-color-1);
    }
`
