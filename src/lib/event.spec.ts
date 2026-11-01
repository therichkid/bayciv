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
		expect(params.get('from_date')).toBe('2026-03-01');
		expect(params.get('page')).toBe('1');
		expect(params.get('per_page')).toBe('20');
		expect(params.get('filter[meta_query][0][key]')).toBe('is_main_event');
		expect(params.get('filter[meta_query][0][value]')).toBe(isMainEvent ? '1' : '0');
		expect(params.get('filter[meta_key]')).toBe('date_from');
		expect(params.get('filter[orderby]')).toBe('meta_value');
		expect(params.get('filter[order]')).toBe('ASC');
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
		expect(new URL(fetchMock.mock.calls[2][0].toString()).searchParams.has('filter[meta_query][0][key]')).toBe(false);
	});

	it('sorts events by date and time', async () => {
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValue(
					response([event(1, '2026-03-02', '09:00'), event(2, '2026-03-01', '16:00'), event(3, '2026-03-01', '10:00')]),
				),
		);
		expect((await getEvents(from)).events.map((item) => item.id)).toEqual([3, 2, 1]);
	});

	it('does not cache failed requests and allows a retry', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(new Response('error', { status: 500 }))
			.mockResolvedValueOnce(response());
		vi.stubGlobal('fetch', fetchMock);
		await expect(getEvents(from)).rejects.toThrow('HTTP 500');
		expect(eventState.isLoading).toBe(false);
		await getEvents(from);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('stays loading until both filtered requests finish', async () => {
		let finishMain!: (value: Response) => void;
		let finishRegular!: (value: Response) => void;
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockImplementationOnce(() => new Promise((resolve) => (finishMain = resolve)))
				.mockImplementationOnce(() => new Promise((resolve) => (finishRegular = resolve))),
		);
		const main = getEvents(from, undefined, 1, true);
		const regular = getEvents(from, undefined, 1, false);
		finishMain(response());
		await main;
		expect(eventState.isLoading).toBe(true);
		finishRegular(response());
		await regular;
		expect(eventState.isLoading).toBe(false);
	});
});
