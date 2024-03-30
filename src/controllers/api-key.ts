import APIKey from '../api/api-key'

export function setAPIKey(value: string) {
    return APIKey.set(value)
}

export function deleteAPIKey() {
    return APIKey.remove()
}
