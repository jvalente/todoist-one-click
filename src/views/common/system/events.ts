/**
 * SELECT
 */
export class SelectChangeEvent extends CustomEvent<{ selectedValue: string }> {
    constructor(value: string) {
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

export class InputEnterPressEvent extends CustomEvent<undefined> {
    constructor() {
        super('enterPress', {})
    }
}
