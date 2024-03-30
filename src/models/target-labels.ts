import Storage from '../storage/storage.js'

function get() {
    return Storage.get<string[]>('targetLabels').then(
        (targetLabels) => targetLabels
    )
}

function set(targetLabels: string[]) {
    return Storage.set('targetLabels', targetLabels)
}

function addChangeListener(callback: (targetLabels: string[]) => void) {
    chrome.storage.local.onChanged.addListener((changes) => {
        if (
            changes.targetLabels &&
            changes.targetLabels.newValue !== changes.targetLabels.oldValue
        ) {
            callback(changes.targetLabels.newValue)
        }
    })
}

const TargetLabels = {
    get,
    set,
    addChangeListener,
}

export default TargetLabels
