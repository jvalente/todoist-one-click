import DueDate from '../models/due-date'
import FailedTasks from '../models/failed-tasks'
import TargetLabels from '../models/target-labels'
import TargetProjectId from '../models/target-project-id'
import { Task } from '../models/task'

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

    Promise.all([
        TargetProjectId.get(),
        TargetLabels.get(),
        DueDate.get(),
        getTabInfo,
    ])
        .then(([projectId, labels, dueDate, { title, url }]) => {
            // TODO: Validate the content
            const content = `[${title}](${url})`
            const task = new Task({ content, projectId, labels, dueDate })

            task.flush().catch((error) => {
                FailedTasks.add(task, error)

                // TODO: does this belong here?
                chrome.runtime.openOptionsPage()
            })
        })
        .catch(() => {
            // TODO: Handle validation error?
        })
}
