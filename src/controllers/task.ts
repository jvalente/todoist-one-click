import { Icon, Tabs } from '../api/extension'
import FailedTasks from '../models/failed-tasks'
import Rules from '../models/rules'
import { Task } from '../models/task'
import Projects from '../models/projects'
import { llmAPI } from '../api/llm'

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
    return (
        title && url ? Promise.resolve({ title, url }) : Tabs.getActiveTab()
    ).then(({ title, url }) => {
        return Promise.all([
            Promise.resolve({ title, url }),
            Rules.getByUrl(url),
        ]).then(
            ([
                { title, url },
                { projectId, labels, dueDate, default: isDefault },
            ]) => {
                // default rule was inferred and guessProject is enabled
                if (isDefault && true) {
                    // replace true with the guess option
                    return guessProject(title, url).then(
                        (guessedProjectId) => ({
                            title,
                            url,
                            projectId: guessedProjectId || projectId,
                            labels,
                            dueDate,
                        }),
                    )
                }

                return {
                    title,
                    url,
                    projectId,
                    labels,
                    dueDate,
                }
            },
        )
    })
}

function guessProject(title: string, url: string) {
    return Projects.getAllNames()
        .then((projects) =>
            projects ? llmAPI.guessProject(projects, title, url) : undefined,
        )
        .then((guessedProjectName) => {
            if (!guessedProjectName) return undefined

            return Projects.getByName(guessedProjectName).then(
                (project) => project?.id,
            )
        })
}
