import { Icon, Tabs } from '../api/extension'
import { analyticsAPI, llmAPI } from '../api/misc'
import FailedTasks from '../models/failed-tasks'
import { GuessProjectOption } from '../models/guess-project-option'
import Projects from '../models/projects'
import Rules from '../models/rules'
import { Task } from '../models/task'

type TaskSource = {
    title: string
    url: string
}

type AddTaskOptions = {
    recordFailure?: boolean
}

export async function addTask(
    title?: string,
    url?: string,
    { recordFailure = true }: AddTaskOptions = {},
): Promise<boolean> {
    Icon.setLoading()

    let source: TaskSource | undefined

    try {
        source = await getTaskSource(title, url)
        const { projectId, labels, dueDate, guessProjectEnabled } =
            await getTaskProps(source)
        const task = new Task({ ...source, projectId, labels, dueDate })
        const { user_id: userId } = await task.flush()

        Icon.setSuccess()
        analyticsAPI.registerEvent(guessProjectEnabled, userId)

        return true
    } catch (error) {
        Icon.setError()

        if (source && recordFailure) {
            await FailedTasks.add(source, error)
            chrome.runtime.openOptionsPage()
        }

        return false
    }
}

function getTaskSource(title?: string, url?: string): Promise<TaskSource> {
    const source =
        title !== undefined || url !== undefined
            ? Promise.resolve({ title, url })
            : Tabs.getActiveTab()

    return source.then(({ title, url }) => {
        if (!title) throw new Error('Title is required')
        if (!url) throw new Error('URL is required')

        return { title, url }
    })
}

function getTaskProps({ title, url }: TaskSource) {
    return Promise.all([Rules.getByUrl(url), GuessProjectOption.get()]).then(
        ([
            { projectId, labels, dueDate, default: isDefault },
            guessProjectEnabled,
        ]) => {
            // default rule was inferred and guessProject is enabled
            if (isDefault && guessProjectEnabled) {
                return guessProject(title, url).then((guessedProjectId) => ({
                    projectId: guessedProjectId || projectId,
                    labels,
                    dueDate,
                    guessProjectEnabled: true,
                }))
            }

            return {
                projectId,
                labels,
                dueDate,
                guessProjectEnabled: guessProjectEnabled === true,
            }
        },
    )
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
