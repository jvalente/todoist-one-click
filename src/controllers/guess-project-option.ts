import { GuessProjectOption } from '../models/guess-project-option'

export function setGuessProjectOption(value: boolean) {
    return GuessProjectOption.set(value)
}
