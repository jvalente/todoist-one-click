vi.mock('../../models/api-key.ts')
import { expect, it, vi, describe, beforeEach, afterEach } from 'vitest'
import Model from '../../models/model'
import Storage from '../../storage/storage'
import API from '../../api/api'

vi.mock('../../storage/storage.ts')

const mockStorageData = () => ({
    data: { source: 'storage' },
    lastUpdated: 123,
})

const mockApiData = () => ({ source: 'api' })

describe('model hydration', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('hydrates from storage if the key exists', async () => {
        const mockListener = vi.fn()

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

    it('hydrates with undefined if the key does not exist in storage and no API strategy exists', async () => {
        const mockListener = vi.fn()

        vi.spyOn(Storage, 'get').mockResolvedValue(undefined)
        const mockStorageSet = vi.spyOn(Storage, 'set').mockResolvedValue()
        const mockAPI = vi.spyOn(API, 'fetchTodoistApi').mockResolvedValue({})

        const model = new Model('model')
        model.attach(mockListener)
        model.hydrate()

        await vi.runAllTimersAsync()

        expect(mockListener).toHaveBeenCalledOnce()
        expect(mockListener).toHaveBeenCalledWith({
            data: undefined,
            lastUpdated: expect.any(Number),
        })
        expect(mockStorageSet).toHaveBeenCalledWith('model', {
            data: undefined,
            lastUpdated: expect.any(Number),
        })
        expect(mockAPI).not.toHaveBeenCalled()
    })

    it('hydrates from API if the key does not exist in storage and fetch information is provided', async () => {
        const mockListener = vi.fn()

        vi.spyOn(Storage, 'get').mockResolvedValue(undefined)
        vi.spyOn(API, 'fetchTodoistApi').mockResolvedValue(mockApiData())
        const mockStorageSet = vi.spyOn(Storage, 'set').mockResolvedValue()

        const model = new Model('model', { url: 'test' })
        model.attach(mockListener)
        model.hydrate()

        await vi.runAllTimersAsync()

        expect(mockListener).toHaveBeenCalledWith({
            data: mockApiData(),
            lastUpdated: expect.any(Number),
        })

        expect(mockStorageSet).toHaveBeenCalledWith('model', {
            data: mockApiData(),
            lastUpdated: expect.any(Number),
        })
    })
})
