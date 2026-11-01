import { SvelteDate, SvelteMap, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

import type { WP_REST_API_Event, WP_REST_API_Events } from './models/wordpress';

type DateKey = string;
type PageNumber = number;

interface EventMeta {
	totalEvents: number;
	totalPages: number;
}

const PER_PAGE = 20;
let activeRequests = 0;

export const eventState = $state<{
	byDate: SvelteMap<DateKey, { events: SvelteMap<PageNumber, WP_REST_API_Events> } & EventMeta>;
	isLoading: boolean;
}>({
	byDate: new SvelteMap(),
	isLoading: false,
});

export const getEvents = async (
	from?: SvelteDate,
	to?: SvelteDate,
	page = 1,
	isMainEvent?: boolean,
): Promise<{ events: WP_REST_API_Events } & EventMeta> => {
	const dateKey = getDateKey(from, to, isMainEvent);

	let cache = eventState.byDate.get(dateKey);
	if (!cache) {
		cache = {
			events: new SvelteMap(),
			totalEvents: 0,
			totalPages: 0,
		};
		eventState.byDate.set(dateKey, cache);
	}

	if (cache.events.has(page)) {
		return {
			events: cache.events.get(page)!,
			totalEvents: cache.totalEvents,
			totalPages: cache.totalPages,
		};
	}

	activeRequests++;
	eventState.isLoading = true;

	try {
		const url = new SvelteURL('https://admin.bayciv.de/wp-json/custom/v1/events');
		const params = new SvelteURLSearchParams({
			per_page: PER_PAGE.toString(),
			page: page.toString(),
			_embed: 'true',
		});

		if (from) {
			params.set('from_date', from.toISOString().split('T')[0]);
		}
		if (to) {
			params.set('to_date', to.toISOString().split('T')[0]);
		}
		if (isMainEvent !== undefined) {
			params.set('_embed', isMainEvent ? 'wp:term,wp:featuredmedia' : 'wp:term');
			params.set('filter[meta_query][0][key]', 'is_main_event');
			params.set('filter[meta_query][0][value]', isMainEvent ? '1' : '0');
			// The filter's meta query and sort key must be separate to preserve date ordering.
			params.set('filter[meta_key]', 'date_from');
			params.set('filter[orderby]', 'meta_value');
			params.set('filter[order]', 'ASC');
		}
		url.search = params.toString();

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to load events: HTTP ${response.status}`);
		}

		const totalEvents = response.headers.get('X-WP-Total');
		const totalPages = response.headers.get('X-WP-TotalPages');

		const events = await response.json();
		const sortedEvents = events.sort(
			(a: WP_REST_API_Event, b: WP_REST_API_Event) =>
				a.acf.date_from.localeCompare(b.acf.date_from) || a.acf.time_from.localeCompare(b.acf.time_from),
		);

		cache.events.set(page, sortedEvents);
		cache.totalEvents = totalEvents ? parseInt(totalEvents) : 0;
		cache.totalPages = totalPages ? parseInt(totalPages) : 0;

		return {
			events: sortedEvents,
			totalEvents: cache.totalEvents,
			totalPages: cache.totalPages,
		};
	} finally {
		activeRequests--;
		eventState.isLoading = activeRequests > 0;
	}
};

const getDateKey = (from?: SvelteDate, to?: SvelteDate, isMainEvent?: boolean): string => {
	return `from=${from?.toISOString().split('T')[0] || ''}&to=${to?.toISOString().split('T')[0] || ''}&main=${isMainEvent ?? 'all'}`;
};
