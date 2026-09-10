import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../api/extension', () => ({
    Icon: { setLoading: vi.fn(), setSuccess: vi.fn(), setError: vi.fn() },
    Tabs: { getActiveTab: vi.fn() },
}))

vi.mock('../api/misc', () => ({
    analyticsAPI: { registerEvent: vi.fn() },
    llmAPI: { guessProject: vi.fn() },
}))

vi.mock('../models/failed-tasks', () => ({ default: { add: vi.fn() } }))
vi.mock('../models/guess-project-option', () => ({
    GuessProjectOption: { get: vi.fn() },
}))
vi.mock('../models/projects', () => ({
    default: { getAllNames: vi.fn(), getByName: vi.fn() },
}))
vi.mock('../models/rules', () => ({ default: { getByUrl: vi.fn() } }))
vi.mock('../models/task', () => ({ Task: vi.fn() }))

import { Icon, Tabs } from '../api/extension'
import FailedTasks from '../models/failed-tasks'
import { GuessProjectOption } from '../models/guess-project-option'
import Rules from '../models/rules'
import { addTask } from './task'

describe('adding tasks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        global.chrome = { runtime: { openOptionsPage: vi.fn() } } as any
        vi.mocked(GuessProjectOption.get).mockResolvedValue(false)
        vi.mocked(FailedTasks.add).mockResolvedValue()
    })

    it('does not retry a saved task against the active tab when its URL is missing', async () => {
        vi.mocked(Tabs.getActiveTab).mockResolvedValue({
            title: 'Active tab',
            url: 'https://active.example.com',
            id: undefined,
        })

        const added = await addTask('Saved task', undefined)

        expect(added).toBe(false)
        expect(Tabs.getActiveTab).not.toHaveBeenCalled()
        expect(Rules.getByUrl).not.toHaveBeenCalled()
        expect(Icon.setError).toHaveBeenCalledOnce()
    })

    it('records failures that occur after reading the active tab', async () => {
        const error = new Error('Unable to load rules')
        const source = {
            title: 'Active tab',
            url: 'https://active.example.com',
        }
        vi.mocked(Tabs.getActiveTab).mockResolvedValue({
            ...source,
            id: undefined,
        })
        vi.mocked(Rules.getByUrl).mockRejectedValue(error)

        const added = await addTask()

        expect(added).toBe(false)
        expect(FailedTasks.add).toHaveBeenCalledWith(source, error)
        expect(chrome.runtime.openOptionsPage).toHaveBeenCalledOnce()
    })
})
