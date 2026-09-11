/**
 * SELECT
 */
export class SelectChangeEvent<ValuesType = string> extends CustomEvent<{
    selectedValue: ValuesType
}> {
    constructor(value: ValuesType) {
        super('change', {
            detail: { selectedValue: value },
        })
    }

    get selectedValue() {
        return this.detail.selectedValue
    }
}

/**
 * INPUT (TEXT)
 */
export class InputChangeEvent extends CustomEvent<{ value: string }> {
    constructor(_value: string) {
        super('change', {
            detail: { value: _value },
        })
    }

    get value() {
        return this.detail.value
    }
}

export class InputEnterPressEvent extends CustomEvent<{ value: string }> {
    constructor(_value: string) {
        super('enterPress', {
            detail: { value: _value },
        })
    }
}

/**
 * DUE DATE
 */
export class DueDateChangeEvent extends CustomEvent<{ dueDate: string }> {
    constructor(dueDate: string) {
        super('change', {
            detail: { dueDate },
        })
    }

    get dueDate() {
        return this.detail.dueDate
    }
}

/**
 * SWITCH
 */
export class SwitchChangeEvent extends CustomEvent<{ checked: boolean }> {
    constructor(_checked: boolean) {
        super('change', {
            detail: { checked: _checked },
        })
    }

    get checked() {
        return this.detail.checked
    }
}
