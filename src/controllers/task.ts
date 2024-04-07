import API from '../api/api'
import TargetLabels from '../models/target-labels'
import TargetProjectId from '../models/target-project-id'

export function addTask() {
    const getTabInfo = chrome.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
            const currentTab = tabs[0]
            return {
                title: currentTab.title,
                url: currentTab.url,
                id: currentTab.id,
            }
        })

    Promise.all([TargetProjectId.get(), TargetLabels.get(), getTabInfo])
        .then(([projectId, labels, { title, url }]) => {
            const content = `[${title}](${url})`

            return API.fetchTodoistApi('tasks', {
                method: 'POST',
                body: {
                    content,
                    project_id: projectId,
                    labels,
                },
            })
        })
        .catch((error) => {
            chrome.runtime.openOptionsPage()
            console.log(error)
        })
}
