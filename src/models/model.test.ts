vi.mock('../../models/api-key')
import { expect, it, vi, describe, beforeEach, afterEach } from 'vitest'
import Model from '../../src/models/model'
import { Storage } from '../api/extension'
import { TodoistAPI } from '../api/todoist'

vi.mock('../../storage/storage')
const mockListener = vi.fn()

const mockStorageData = () => ({
    data: { source: 'storage' },
    lastUpdated: 123,
})

const mockApiData = () => ({ source: 'api' })

describe('model hydration', () => {
    beforeEach(() => {
        vi.spyOn(Storage, 'addListener').mockImplementation(vi.fn())
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('hydrates from storage if the key exists', async () => {
        vi.spyOn(Storage, 'get').mockResolvedValue(mockStorageData())
        const mockStorageSet = vi.spyOn(Storage, 'set').mockResolvedValue()

        const model = new Model('model')
        model.attach(mockListener)
        model.hydrate()

        await vi.runAllTimersAsync()

        expect(mockListener).toHaveBeenCalledOnce()
        expect(mockListener).toHaveBeenCalledWith(mockStorageData())
        expect(mockStorageSet).not.toHaveBeenCalled()
    })

    it('hydrates with undefined if the key does not exist in storage and no fetchResource exists', async () => {
        vi.spyOn(Storage, 'get').mockResolvedValue(undefined)
        const mockStorageSet = vi.spyOn(Storage, 'set').mockResolvedValue()
        const mockAPI = vi.spyOn(TodoistAPI, 'request').mockResolvedValue({})

        const model = new Model('model')
        model.hydrate()

        await vi.runAllTimersAsync()

        expect(mockStorageSet).toHaveBeenCalledWith('model', {
            data: undefined,
            lastUpdated: expect.any(Number),
        })
        expect(mockAPI).not.toHaveBeenCalled()
    })

    it('hydrates from API if the key does not exist in storage and fetch information is provided', async () => {
        vi.spyOn(Storage, 'get').mockResolvedValue(undefined)
        vi.spyOn(TodoistAPI, 'request').mockResolvedValue(mockApiData())
        const mockStorageSet = vi.spyOn(Storage, 'set').mockResolvedValue()

        const model = new Model('model', { url: 'test' })
        model.hydrate()

        await vi.runAllTimersAsync()

        expect(mockStorageSet).toHaveBeenCalledWith('model', {
            data: mockApiData(),
            lastUpdated: expect.any(Number),
        })
    })

    describe.todo('storage changes subscription', () => {})

    describe('error', () => {
        it('populates the error state if the API call fails', async () => {
            vi.spyOn(Storage, 'get').mockResolvedValue(undefined)
            const mockAPI = vi
                .spyOn(TodoistAPI, 'request')
                .mockRejectedValue(new Error('API error'))

            const model = new Model('model', { url: 'test' })
            model.attach(mockListener)
            model.hydrate()

            await vi.runAllTimersAsync()

            expect(mockListener).toHaveBeenCalledWith({
                error: new Error('API error'),
            })
        })
    })
})
