// TODO: consider refactoring simple options (guess project, API key) into an abstract model

import { Storage } from '../api/extension'
import { Subject } from '../lib/observer'

const STORAGE_KEY = 'guessProject'

const guessProjectObservable = new Subject<boolean | undefined>()

function get() {
    return Storage.get<boolean>(STORAGE_KEY)
}

function set(value: boolean) {
    Storage.set(STORAGE_KEY, value)
    guessProjectObservable.notify(value)
}

function remove() {
    Storage.remove(STORAGE_KEY)
    guessProjectObservable.notify(undefined)
}

export const GuessProjectOption = {
    get,
    set,
    remove,
    attach: (observer: Parameters<typeof guessProjectObservable.attach>[0]) =>
        guessProjectObservable.attach(observer),
}
