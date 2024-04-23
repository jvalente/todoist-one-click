import { TodoistAPI } from '../api/todoist'
import { Subject } from '../lib/observer'
import { Storage } from '../api/extension'

export type ModelState<T> = {
    data: T | undefined
    lastUpdated?: number
    error?: unknown
}

class Model<T> extends Subject<ModelState<T>> {
    private name: string
    private fetchResource?: { url: string }
    private defaultState?: T

    constructor(
        name: string,
        {
            fetchResource,
            defaultState,
        }: { fetchResource?: { url: string }; defaultState?: T } = {}
    ) {
        super()

        this.name = name
        this.fetchResource = fetchResource
        this.defaultState = defaultState

        Storage.addListener((changes) => {
            if (changes[this.name]) {
                this.notify(changes[this.name].newValue || { data: undefined })
            }
        })
    }

    private hydrateFromStorage() {
        return Storage.get<ModelState<T>>(this.name)
    }

    private hydrateFromAPI() {
        if (!this.fetchResource) return Promise.resolve(undefined)

        return TodoistAPI.request<T>(this.fetchResource.url)
    }

    hydrate() {
        this.hydrateFromStorage()
            .then((storageData) => {
                if (storageData) {
                    return { value: storageData, persist: false }
                } else {
                    return this.hydrateFromAPI().then((apiData) => {
                        return {
                            value: { data: apiData || this.defaultState },
                            persist: true,
                        }
                    })
                }
            })
            .then(({ value, persist }) => {
                if (persist) {
                    this.set(value.data)
                } else {
                    this.notify(value || { data: undefined })
                }
            })
            .catch((error) => {
                this.notify({ data: undefined, error, lastUpdated: undefined })
            })
    }

    get() {
        return Storage.get<Record<string, T>>(this.name).then(
            (value) => value?.data
        )
    }

    set(data: T | undefined) {
        const lastUpdated = Date.now()

        Storage.set(this.name, {
            data,
            lastUpdated,
        })
    }

    delete() {
        Storage.remove(this.name)
    }
}

export default Model
