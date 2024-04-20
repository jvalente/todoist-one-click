const SUCCESS_ICON_TIMEOUT = 2000

export function setLoading() {
    chrome.action.setIcon({
        path: {
            '48': 'icons/loading.png',
            '96': 'icons/loading@2x.png',
        },
    })
}

export function setSuccess() {
    chrome.action.setIcon({
        path: {
            '48': 'icons/success.png',
            '96': 'icons/success@2x.png',
        },
    })

    setTimeout(() => {
        chrome.action.setIcon({
            path: {
                '48': 'icons/icon.png',
                '96': 'icons/icon@2x.png',
            },
        })
    }, SUCCESS_ICON_TIMEOUT)
}

export const Icon = { setLoading, setSuccess }
