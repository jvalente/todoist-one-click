import { Icon, Tabs } from '../api/extension'
import FailedTasks from '../models/failed-tasks'
import Rules from '../models/rules'
import { Task } from '../models/task'

export function addTask(title?: string, url?: string) {
    Icon.setLoading()

    getTaskProps(title, url)
        .then(({ title, url, projectId, labels, dueDate }: any) => {
            if (!title) throw new Error('Title is required')

            const task = new Task({
                title,
                url,
                projectId,
                labels,
                dueDate,
            })

            task.flush()
                .then(() => Icon.setSuccess())
                .catch((error) => {
                    Icon.setError()
                    const { title, url } = task
                    FailedTasks.add({ title, url }, error)

                    // TODO introduce an error icon?
                    // TODO: does this belong here?
                    chrome.runtime.openOptionsPage()
                })
        })
        .catch(() => {
            Icon.setError()

            // TODO: Handle validation error?
            // global error handler?
        })
}

function getTaskProps(title?: string, url?: string) {
    return Promise.all([
        Rules.getDefault(),
        title && url ? Promise.resolve({ title, url }) : Tabs.getActiveTab(),
    ]).then(([{ projectId, labels, dueDate }, { title, url }]) => {
        // TODO: Improve content validation

        return {
            title,
            url,
            projectId,
            labels,
            dueDate,
        }
    })
}
