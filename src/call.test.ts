import fetchMock from 'jest-fetch-mock';

import { call, get, del, post, put, patch } from './call';

interface MockResponse<T = any> {
    url: string;
    method: string;
    body: T;
}

const TEST_URL = 'https://example.com';

describe('call functions', function () {
    beforeEach(() => {
        fetchMock.mockIf(/^https?:\/\/example.com.*$/, async (req) => {
            if (req.url.endsWith('/pass')) {
                return {
                    body: JSON.stringify({
                        url: req.url,
                        method: req.method,
                        body: req.body,
                    }),
                };
            } else if (req.url.endsWith('/throw')) {
                return {
                    status: 404,
                    body: JSON.stringify({
                        url: req.url,
                        method: req.method,
                        body: req.body,
                    }),
                };
            } else if (req.url.endsWith('/text')) {
                return {
                    body: 'text',
                };
            } else {
                return {
                    status: 404,
                    body: 'not found',
                };
            }
        });
    });

    describe('call', function () {
        it('should fetch from an API', async function () {
            const result = await call<MockResponse>(`${TEST_URL}/pass`);
            expect(result.method).toBe('GET');
        });

        it('should throw on >= 300', async function () {
            await expect(call<MockResponse>(`${TEST_URL}/throw`)).rejects.toThrow();
        });

        it('should fetch text from an API', async function () {
            const result = await call<string>(`${TEST_URL}/text`, { isText: true });
            expect(result).toBe('text');
        });
    });

    describe('get', function () {
        it('should get from an API', async function () {
            const result = await get<MockResponse>(`${TEST_URL}/pass`);
            expect(result.method).toBe('GET');
        });
    });

    describe('post', function () {
        it('should post to an API', async function () {
            const result = await post<{ value: string }, MockResponse>(`${TEST_URL}/pass`, { value: 'test' });
            expect(result.method).toBe('POST');
        });
    });

    describe('put', function () {
        it('should put to an API', async function () {
            const result = await put<{ value: string }, MockResponse>(`${TEST_URL}/pass`, { value: 'test' });
            expect(result.method).toBe('PUT');
        });
    });

    describe('patch', function () {
        it('should patch to an API', async function () {
            const result = await patch<{ value: string }, MockResponse>(`${TEST_URL}/pass`, { value: 'test' });
            expect(result.method).toBe('PATCH');
        });
    });

    describe('del', function () {
        it('should delete from an API', async function () {
            const result = await del<MockResponse>(`${TEST_URL}/pass`);
            expect(result.method).toBe('DELETE');
        });
    });
});
