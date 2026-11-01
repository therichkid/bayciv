import { SvelteMap, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Events } from './models/wordpress';

type DateKey = string;
type PageNumber = number;

interface EventMeta {
	totalEvents: number;
	totalPages: number;
}

const PER_PAGE = 20;
export const eventState = {
	byDate: new SvelteMap<DateKey, { events: SvelteMap<PageNumber, WP_REST_API_Events> } & EventMeta>(),
};

export const getEvents = async (
	from?: Date,
	to?: Date,
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

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/custom/v1/events');
	const params = new SvelteURLSearchParams({
		per_page: PER_PAGE.toString(),
		page: page.toString(),
		_embed: 'true',
	});

	if (from) {
		params.set('date_from', from.toISOString().split('T')[0]);
	}
	if (to) {
		params.set('date_to', to.toISOString().split('T')[0]);
	}
	if (isMainEvent !== undefined) {
		params.set('_embed', isMainEvent ? 'wp:term,wp:featuredmedia' : 'wp:term');
		params.set('is_main_event', String(isMainEvent));
	}
	url.search = params.toString();

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load events: HTTP ${response.status}`);
	}

	const totalEvents = response.headers.get('X-WP-Total');
	const totalPages = response.headers.get('X-WP-TotalPages');

	const events: WP_REST_API_Events = await response.json();

	cache.events.set(page, events);
	cache.totalEvents = totalEvents ? parseInt(totalEvents) : 0;
	cache.totalPages = totalPages ? parseInt(totalPages) : 0;

	return {
		events,
		totalEvents: cache.totalEvents,
		totalPages: cache.totalPages,
	};
};

const getDateKey = (from?: Date, to?: Date, isMainEvent?: boolean): string => {
	return `from=${from?.toISOString().split('T')[0] || ''}&to=${to?.toISOString().split('T')[0] || ''}&main=${isMainEvent ?? 'all'}`;
};
