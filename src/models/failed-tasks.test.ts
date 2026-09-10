import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../api/extension', () => ({
    Storage: {
        addListener: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
    },
}))

vi.mock('../api/todoist', () => ({
    TodoistAPI: { request: vi.fn() },
    TodoistAPIError: class TodoistAPIError extends Error {},
}))

import { Storage } from '../api/extension'
import FailedTasks from './failed-tasks'

const task = (title: string) => ({ title, url: `https://${title}.example.com` })

describe('failed task storage', () => {
    const data: Record<string, any> = {}

    beforeEach(() => {
        vi.clearAllMocks()
        delete data.failedTasks
        vi.mocked(Storage.get).mockImplementation(async (key) => data[key])
        vi.mocked(Storage.set).mockImplementation(async (key, value) => {
            data[key] = value
        })
    })

    it('retains concurrent failures', async () => {
        await Promise.all([
            FailedTasks.add(task('first'), new Error('First failure')),
            FailedTasks.add(task('second'), new Error('Second failure')),
        ])

        expect(data.failedTasks.data).toHaveLength(2)
        expect(
            data.failedTasks.data.map((failedTask: any) => failedTask.task),
        ).toEqual([task('first'), task('second')])
    })
})
