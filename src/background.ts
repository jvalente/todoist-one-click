import { addTask } from './controllers/task.js'

// context menu settings entry
chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: 'open-settings',
        title: 'Settings…',
        contexts: ['action'],
    })
})

// open settings
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'open-settings') {
        chrome.runtime.openOptionsPage()
    }
})

// action click
chrome.action.onClicked.addListener(() => {
    addTask()
})

// shortcut
chrome.commands.onCommand.addListener((command) => {
    if (command === 'add-task') {
        addTask()
    }
})
