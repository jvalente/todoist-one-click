import { Icon, Tabs } from '../api/extension'
import DueDate from '../models/due-date'
import FailedTasks from '../models/failed-tasks'
import TargetLabels from '../models/target-labels'
import TargetProjectId from '../models/target-project-id'
import { Task } from '../models/task'

export function addTask(taskProps?: any) {
    Icon.setLoading()

    const prepareTask = new Promise((resolve) => {
        if (taskProps) {
            resolve(taskProps)
        } else {
            resolve(getTaskProps())
        }
    })

    prepareTask
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
                    FailedTasks.add(task, error)

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

function getTaskProps() {
    return Promise.all([
        TargetProjectId.get(),
        TargetLabels.get(),
        DueDate.get(),
        Tabs.getActiveTab(),
    ]).then(([projectId, labels, dueDate, { title, url }]) => {
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
