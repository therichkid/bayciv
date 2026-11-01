import { SvelteDate } from 'svelte/reactivity';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { eventState, getEvents } from './event.svelte';

const from = new SvelteDate('2026-03-01T00:00:00.000Z');
const event = (id: number, date_from: string, time_from = '') => ({ id, acf: { date_from, time_from } });
const response = (events: ReturnType<typeof event>[] = []) =>
	new Response(JSON.stringify(events), { headers: { 'X-WP-Total': String(events.length), 'X-WP-TotalPages': '1' } });

afterEach(() => {
	vi.unstubAllGlobals();
	eventState.byDate.clear();
});

describe('getEvents', () => {
	it.each([true, false])('requests one date-sorted page filtered by is_main_event=%s', async (isMainEvent) => {
		const fetchMock = vi.fn<(input: RequestInfo | URL) => Promise<Response>>().mockResolvedValue(response());
		vi.stubGlobal('fetch', fetchMock);

		await getEvents(from, undefined, 1, isMainEvent);
		const params = new URL(fetchMock.mock.calls[0][0].toString()).searchParams;
		expect(params.get('date_from')).toBe('2026-03-01');
		expect(params.get('page')).toBe('1');
		expect(params.get('per_page')).toBe('20');
		expect(params.get('is_main_event')).toBe(String(isMainEvent));
		expect([...params.keys()].some((key) => key.startsWith('filter['))).toBe(false);
		expect(params.get('_embed')).toBe(isMainEvent ? 'wp:term,wp:featuredmedia' : 'wp:term');
	});

	it('keeps main, regular and unfiltered results in separate caches', async () => {
		const fetchMock = vi
			.fn<(input: RequestInfo | URL) => Promise<Response>>()
			.mockResolvedValueOnce(response([event(1, '2026-03-01')]))
			.mockResolvedValueOnce(response([event(2, '2026-03-01')]))
			.mockResolvedValueOnce(response([event(3, '2026-03-01')]));
		vi.stubGlobal('fetch', fetchMock);

		expect((await getEvents(from, undefined, 1, true)).events[0].id).toBe(1);
		expect((await getEvents(from, undefined, 1, false)).events[0].id).toBe(2);
		expect((await getEvents(from)).events[0].id).toBe(3);
		expect((await getEvents(from, undefined, 1, true)).events[0].id).toBe(1);
		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(new URL(fetchMock.mock.calls[2][0].toString()).searchParams.has('is_main_event')).toBe(false);
	});

	it('preserves the order returned by the endpoint', async () => {
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValue(
					response([event(1, '2026-03-02', '09:00'), event(2, '2026-03-01', '16:00'), event(3, '2026-03-01', '10:00')]),
				),
		);
		expect((await getEvents(from)).events.map((item) => item.id)).toEqual([1, 2, 3]);
	});

	it('does not cache failed requests and allows a retry', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(new Response('error', { status: 500 }))
			.mockResolvedValueOnce(response());
		vi.stubGlobal('fetch', fetchMock);
		await expect(getEvents(from)).rejects.toThrow('HTTP 500');
		await getEvents(from);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('keeps concurrent main and regular event requests separate', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(response([event(1, '2026-03-01')]))
			.mockResolvedValueOnce(response([event(2, '2026-03-01')]));
		vi.stubGlobal('fetch', fetchMock);

		const [main, regular] = await Promise.all([
			getEvents(from, undefined, 1, true),
			getEvents(from, undefined, 1, false),
		]);
		expect(main.events[0].id).toBe(1);
		expect(regular.events[0].id).toBe(2);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});
