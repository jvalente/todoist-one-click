function getVersion() {
    try {
        return chrome.runtime.getManifest().version
    } catch {
        return 'unknown'
    }
}

export const Manifest = { getVersion }