import API from '../api/api'
import Subject from '../observer/subject'
import Storage from '../storage/storage'

export type ModelState<T> = {
    data: T | undefined
    lastUpdated?: number
    error?: unknown
}

class Model<T> extends Subject<ModelState<T>> {
    private name: string
    private fetchResource?: { url: string }

    constructor(name: string, fetchResource?: { url: string }) {
        super()

        this.name = name
        this.fetchResource = fetchResource
    }

    private hydrateFromStorage() {
        return Storage.get<ModelState<T>>(this.name)
    }

    private hydrateFromAPI() {
        if (!this.fetchResource) return Promise.resolve(undefined)

        return API.fetchTodoistApi<T>(this.fetchResource.url)
    }

    hydrate() {
        this.hydrateFromStorage()
            .then((storageData) => {
                if (storageData) {
                    return { value: storageData, persist: false }
                } else {
                    return this.hydrateFromAPI().then((apiData) => ({
                        value: { data: apiData },
                        persist: true,
                    }))
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
        return Storage.get<Record<string, unknown>>(this.name).then(
            (value) => value?.data
        )
    }

    set(data: T | undefined) {
        const lastUpdated = Date.now()

        Storage.set(this.name, {
            data,
            lastUpdated,
        }).then(() => {
            this.notify({ data, lastUpdated })
        })
    }

    delete() {
        Storage.remove(this.name).then(() => {
            this.notify({
                data: undefined,
                lastUpdated: undefined,
                error: undefined,
            })
        })
    }
}

export default Model
