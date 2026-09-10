import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../models/failed-tasks', () => ({
    default: { discard: vi.fn() },
}))

vi.mock('./task', () => ({ addTask: vi.fn() }))

import FailedTasks from '../models/failed-tasks'
import { retryFailedTask } from './failed-tasks'
import { addTask } from './task'
import type { FailedTask } from '../types/tasks.type'

const failedTask: FailedTask = {
    id: 'failed-task-id',
    task: { title: 'Saved task', url: 'https://example.com' },
    error: new Error('Network error'),
}

describe('retrying failed tasks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('removes the failed task after a successful retry', async () => {
        vi.mocked(addTask).mockResolvedValue(true)
        vi.mocked(FailedTasks.discard).mockResolvedValue()

        await retryFailedTask(failedTask)

        expect(addTask).toHaveBeenCalledWith(
            failedTask.task.title,
            failedTask.task.url,
            { recordFailure: false },
        )
        expect(FailedTasks.discard).toHaveBeenCalledWith(failedTask.id)
    })

    it('keeps the failed task when retrying fails', async () => {
        vi.mocked(addTask).mockResolvedValue(false)

        await retryFailedTask(failedTask)

        expect(FailedTasks.discard).not.toHaveBeenCalled()
    })

    it('keeps failed tasks with incomplete saved data', async () => {
        await retryFailedTask({
            ...failedTask,
            task: { title: 'Saved task', url: '' },
        })

        expect(addTask).not.toHaveBeenCalled()
        expect(FailedTasks.discard).not.toHaveBeenCalled()
    })
})
