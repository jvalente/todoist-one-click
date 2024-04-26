export class SelectChangeEvent extends CustomEvent<{ selectedValue: string }> {
    constructor(public value: string) {
        super('change', {
            detail: { selectedValue: value },
        })
    }

    get selectedValue() {
        return this.detail.selectedValue
    }
}
