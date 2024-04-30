function getActiveTab() {
    // TODO: refine error handling
    return chrome.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
            const currentTab = tabs[0]
            return {
                title: currentTab.title || '',
                url: currentTab.url || '',
                id: currentTab.id,
            }
        })
}

export const Tabs = { getActiveTab }
