import { Tabs } from '../api/extension'
import DueDate from '../models/due-date'
import FailedTasks from '../models/failed-tasks'
import TargetLabels from '../models/target-labels'
import TargetProjectId from '../models/target-project-id'
import { Task } from '../models/task'

export function addTask() {
    Promise.all([
        TargetProjectId.get(),
        TargetLabels.get(),
        DueDate.get(),
        Tabs.getActiveTab(),
    ])
        .then(([projectId, labels, dueDate, { title, url }]) => {
            // TODO: Improve validation
            if (!title) throw new Error('Title is required')
            const content = `[${title}](${url})`

            const task = new Task({
                title,
                content,
                projectId,
                labels,
                dueDate,
            })

            task.flush().catch((error) => {
                FailedTasks.add(task, error)

                // TODO: does this belong here?
                chrome.runtime.openOptionsPage()
            })
        })
        .catch(() => {
            // TODO: Handle validation error?
            // global error handler?
        })
}
