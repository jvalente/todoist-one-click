import { Subject } from '../../lib/observer'
import { Storage } from '../extension'

const STORAGE_KEY = 'apiKey'

const apiKeyObservable = new Subject<string | undefined>()

function get() {
    return Storage.get<string>(STORAGE_KEY)
}

function set(value: string) {
    return Storage.set(STORAGE_KEY, value).then(() => {
        apiKeyObservable.notify(value)
    })
}

function remove() {
    return Storage.remove(STORAGE_KEY).then(() => {
        apiKeyObservable.notify(undefined)
    })
}

export const TodoistAPIKey = {
    get,
    set,
    remove,
    attach: (observer: Parameters<typeof apiKeyObservable.attach>[0]) =>
        apiKeyObservable.attach(observer),
}
