function get<T>(key: string) {
    // chrome.storage.local.get(null).then((data) => console.log(data))

    return new Promise<T | undefined>((resolve, reject) => {
        chrome.storage.local
            .get(key)
            .then((data) => {
                resolve(data[key])
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function set<T>(key: string, value: T) {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.local
            .set({ [key]: value })
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function remove(key: string) {
    return chrome.storage.local.remove(key)
}

function reset() {
    return chrome.storage.local.clear()
}

export default { get, set, remove, reset }
