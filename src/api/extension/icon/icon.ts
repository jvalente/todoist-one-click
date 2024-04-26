const SUCCESS_ICON_TIMEOUT = 2000
const ERROR_ICON_TIMEOUT = 5000

function setDefault() {
    chrome.action.setIcon({
        path: {
            '48': 'icons/icon.png',
            '96': 'icons/icon@2x.png',
        },
    })
}
function setLoading() {
    chrome.action.setIcon({
        path: {
            '48': 'icons/loading.png',
            '96': 'icons/loading@2x.png',
        },
    })
}

function setSuccess() {
    chrome.action.setIcon({
        path: {
            '48': 'icons/success.png',
            '96': 'icons/success@2x.png',
        },
    })

    setTimeout(() => setDefault(), SUCCESS_ICON_TIMEOUT)
}

function setError() {
    chrome.action.setIcon({
        path: {
            '48': 'icons/error.png',
            '96': 'icons/error@2x.png',
        },
    })

    setTimeout(() => setDefault(), ERROR_ICON_TIMEOUT)
}

export const Icon = { setDefault, setLoading, setSuccess, setError }
