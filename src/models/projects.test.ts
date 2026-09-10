import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../api/extension', () => ({
    Storage: {
        addListener: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
    },
}))

vi.mock('../api/todoist', () => ({
    TodoistAPI: { request: vi.fn(), attachUnauthorized: vi.fn() },
}))

import { Storage } from '../api/extension'
import { TodoistAPI } from '../api/todoist'
import Projects from './projects'

const project = (id: string) => ({ id, name: `Project ${id}` })

describe('project hydration', () => {
    beforeEach(() => {
        vi.mocked(Storage.get).mockClear()
        vi.mocked(Storage.set).mockClear()
        vi.mocked(Storage.remove).mockClear()
        vi.mocked(TodoistAPI.request).mockClear()
        vi.mocked(Storage.get).mockResolvedValue(undefined)
        vi.mocked(Storage.set).mockResolvedValue()
    })

    it('fetches and stores every page of projects', async () => {
        vi.mocked(TodoistAPI.request)
            .mockResolvedValueOnce({
                results: [project('first')],
                next_cursor: 'next-page',
            })
            .mockResolvedValueOnce({
                results: [project('second')],
                next_cursor: null,
            })

        await Projects.hydrate()

        expect(TodoistAPI.request).toHaveBeenNthCalledWith(1, 'projects', {
            params: { limit: '200' },
        })
        expect(TodoistAPI.request).toHaveBeenNthCalledWith(2, 'projects', {
            params: { limit: '200', cursor: 'next-page' },
        })
        expect(Storage.set).toHaveBeenCalledWith('projects', {
            data: { results: [project('first'), project('second')] },
            lastUpdated: expect.any(Number),
        })
    })

    it('does not fetch when projects are already cached', async () => {
        vi.mocked(Storage.get).mockResolvedValue({
            data: { results: [project('cached')] },
            lastUpdated: 1,
        })

        await Projects.hydrate()

        expect(TodoistAPI.request).not.toHaveBeenCalled()
    })

    it('does not store partial results if a later page fails', async () => {
        const error = new Error('Unable to load projects')
        const listener = vi.fn()
        Projects.attach(listener)
        vi.mocked(TodoistAPI.request)
            .mockResolvedValueOnce({
                results: [project('first')],
                next_cursor: 'next-page',
            })
            .mockRejectedValueOnce(error)

        await Projects.hydrate()

        expect(Storage.set).not.toHaveBeenCalled()
        expect(listener).toHaveBeenCalledWith({
            data: undefined,
            error,
            lastUpdated: undefined,
        })
    })

    it('clears cached projects after an unauthorized response', async () => {
        const onUnauthorized = vi.mocked(TodoistAPI.attachUnauthorized).mock
            .calls[0][0]

        await onUnauthorized()

        expect(Storage.remove).toHaveBeenCalledWith('projects')
    })
})
