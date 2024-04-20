import {
    expect,
    it,
    vi,
    describe,
    beforeAll,
    beforeEach,
    afterEach,
    afterAll,
} from 'vitest'

import API from '../../src/api/api'
import APIKey from '../../src/api/api-key'

const unmockedFetch = global.fetch
const mockFetch = vi.fn()
global.fetch = mockFetch
global.chrome = {
    action: {
        setIcon: vi.fn(),
    },
} as any

describe('API', () => {
    beforeAll(() => {
        vi.spyOn(APIKey, 'get').mockResolvedValue('apikey')
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
    })

    it('calls fetch with the correct GET parameters', async () => {
        expect.assertions(2)

        return API.fetchTodoistApi('path').then(() => {
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

        return API.fetchTodoistApi('path', { method: 'POST', body }).then(
            () => {
                expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
                    headers: expect.any(Object),
                    method: 'POST',
                    body: JSON.stringify(body),
                })
            }
        )
    })

    it('throws if API key does not exist', async () => {
        expect.assertions(1)

        vi.spyOn(APIKey, 'get').mockRejectedValueOnce(
            new Error('API key not found')
        )

        return API.fetchTodoistApi('path').catch((error) => {
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

        return API.fetchTodoistApi('path').catch((error) => {
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

        return API.fetchTodoistApi('path').catch((error) => {
            expect(error.message).toEqual('Invalid JSON')
        })
    })
})
