import { css } from 'lit'

export const settingsSection = css`
    :host {
        display: block;
    }

    section {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        padding: 28px;
        background-color: var(--section-background-color);
        border: 1px solid var(--section-border-color);
        border-radius: 12px;
        box-shadow: var(--section-shadow);
    }

    h2 {
        margin: 0 0 28px;
        font-size: 25px;
        font-weight: 650;
        line-height: 1.25;
        letter-spacing: -0.7px;
    }

    ::slotted(*) {
        margin: 0 0 20px;
    }

    ::slotted(:last-child) {
        margin-bottom: 0;
    }
`
