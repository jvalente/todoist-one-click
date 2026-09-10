import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../api/todoist', () => ({
    TodoistAPIKey: { set: vi.fn(), remove: vi.fn() },
}))

vi.mock('../models/projects', () => ({ default: { delete: vi.fn() } }))

import { TodoistAPIKey } from '../api/todoist'
import Projects from '../models/projects'
import { deleteAPIKey, setAPIKey } from './api-key'

describe('API key changes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(Projects.delete).mockResolvedValue()
        vi.mocked(TodoistAPIKey.set).mockResolvedValue()
        vi.mocked(TodoistAPIKey.remove).mockResolvedValue()
    })

    it('clears cached projects before saving a token', async () => {
        const clearProjects = deferred()
        vi.mocked(Projects.delete).mockImplementationOnce(
            () => clearProjects.promise,
        )

        const set = setAPIKey('new-token')

        expect(TodoistAPIKey.set).not.toHaveBeenCalled()

        clearProjects.resolve()
        await set

        expect(TodoistAPIKey.set).toHaveBeenCalledWith('new-token')
    })

    it('clears cached projects before removing a token', async () => {
        const clearProjects = deferred()
        vi.mocked(Projects.delete).mockImplementationOnce(
            () => clearProjects.promise,
        )

        const remove = deleteAPIKey()

        expect(TodoistAPIKey.remove).not.toHaveBeenCalled()

        clearProjects.resolve()
        await remove

        expect(TodoistAPIKey.remove).toHaveBeenCalledOnce()
    })
})

function deferred() {
    let resolve = () => {}
    const promise = new Promise<void>((complete) => {
        resolve = complete
    })

    return { promise, resolve }
}
