import {
    expect,
    it,
    vi,
    describe,
    beforeAll,
    afterEach,
    afterAll,
} from 'vitest'

import { TodoistAPI } from './api'
import { TodoistAPIKey } from './api-key'

const unmockedFetch = global.fetch
const unmockedNavigator = global.navigator
const mockFetch = vi.fn()
global.fetch = mockFetch
global.chrome = {
    action: {
        setIcon: vi.fn(),
    },
} as any
global.navigator = { online: true } as any

describe('API', () => {
    beforeAll(() => {
        vi.spyOn(TodoistAPIKey, 'get').mockResolvedValue('apikey')
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ status: 'ok' }),
        })
    })

    afterEach(() => {
        mockFetch.mockClear()
    })

    afterAll(() => {
        global.fetch = unmockedFetch
        global.navigator = unmockedNavigator
    })

    it('calls fetch with the correct GET parameters', async () => {
        expect.assertions(2)

        return TodoistAPI.request('path').then(() => {
            expect(mockFetch).toHaveBeenCalledOnce()
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringMatching(/\/path$/),
                {
                    headers: {
                        Authorization: 'Bearer apikey',
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                }
            )
        })
    })

    it('calls fetch with the correct POST parameters', async () => {
        const body = { labels: ['lorem', 'ipsum'] }
        expect.assertions(1)

        return TodoistAPI.request('path', { method: 'POST', body }).then(() => {
            expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
                headers: expect.any(Object),
                method: 'POST',
                body: JSON.stringify(body),
            })
        })
    })

    it('throws if API key does not exist', async () => {
        expect.assertions(1)

        vi.spyOn(TodoistAPIKey, 'get').mockRejectedValueOnce(
            new Error('API key not found')
        )

        return TodoistAPI.request('path').catch((error) => {
            expect(error.message).toBe('API key not found')
        })
    })

    it('throws if response is not ok', async () => {
        expect.assertions(2)

        mockFetch.mockResolvedValueOnce(
            new Response('Resource not found', {
                status: 404,
                statusText: 'Not Found',
            })
        )

        return TodoistAPI.request('path').catch((error) => {
            expect(error.message).toEqual('Bad response (404)')
            expect(error.status).toEqual(404)
        })
    })

    it('throws if response has no valid json', async () => {
        expect.assertions(1)

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => {
                throw new Error('Invalid JSON')
            },
        })

        return TodoistAPI.request('path').catch((error) => {
            expect(error.message).toEqual('Invalid JSON')
        })
    })
})
