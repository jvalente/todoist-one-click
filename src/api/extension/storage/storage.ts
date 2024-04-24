function get<T>(key: string) {
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

function getAll() {
    return new Promise<any>((resolve, reject) => {
        chrome.storage.local
            .get(null)
            .then((data) => {
                resolve(data)
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

// TODO refine
function addListener(callback: (changes: any) => void) {
    chrome.storage.onChanged.addListener(callback)
}

export const Storage = { get, getAll, set, remove, reset, addListener }
