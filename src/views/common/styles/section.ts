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

    section > * {
        margin: 10px 0;
    }

    section small {
        display: block;
        color: var(--secondary-color);
    }

    section label {
        font-size: var(--title-font-size);
        border-bottom: 1px solid var(--bg-color-3);
        margin-bottom: 5px;
    }

    section input,
    section select {
        border: none;
        border-radius: var(--default-border-radius);
        padding: 10px;
        color: var(--primary-color);
        font-size: var(--global-font-size);
        background-color: var(--bg-color-3);
    }

    section select {
        border-right: 8px solid transparent;
    }

    section button {
        border: none;
        border-radius: var(--default-border-radius);
        padding: 10px;
        font-size: var(--global-font-size);
        color: var(--primary-color-inverted);
        background-color: var(--accent-color-0);
    }

    section button:hover {
        background-color: var(--accent-color-1);
    }

    section code {
        background-color: var(--bg-color-4);
        padding: 3px;
        border-radius: var(--default-border-radius);
    }

    section ul {
        margin: 0;
        padding: 0;
    }

    section ul li {
        list-style: none;
    }
`
