<script lang="ts">
	import EventInfo from '#lib/components/event-info.svelte';
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import CalendarDay from '#lib/components/ui/calendar/calendar-day.svelte';
	import { Calendar } from '#lib/components/ui/calendar/index.js';
	import { getEvents } from '#lib/event.svelte.js';
	import type { WP_REST_API_Event, WP_REST_API_Events } from '#lib/models/wordpress.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { SvelteDate, SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let events = $state<WP_REST_API_Events>([]);

	$effect(() => {
		const { initialEvents, totalPages, from, to } = data;
		let cancelled = false;
		events = [...initialEvents];

		const loadRemainingPages = async () => {
			try {
				for (let page = 2; page <= totalPages; page++) {
					const batch = await getEvents(new SvelteDate(from), new SvelteDate(to), page);
					if (cancelled) return;
					events.push(...batch.events);
				}
			} catch (error) {
				if (!cancelled) {
					console.error('Failed to load remaining events:', error);
					toast.error('Weitere Veranstaltungen konnten nicht geladen werden.');
				}
			}
		};

		if (totalPages > 1) void loadRemainingPages();
		return () => {
			cancelled = true;
		};
	});

	let eventsPerDay = $derived.by(() => {
		return events.reduce((map, event) => {
			const date = event.acf.date_from;
			const dayEvents = map.get(date);
			if (!dayEvents) {
				map.set(date, [event]);
			} else if (!dayEvents.some(({ id }) => id === event.id)) {
				dayEvents.push(event);
			}
			return map;
		}, new Map<string, WP_REST_API_Event[]>());
	});

	let value = $state(today(getLocalTimeZone()));
	let placeholder = $derived(new CalendarDate(data.from.year, data.from.month, 1));

	$effect(() => {
		placeholder = new CalendarDate(data.from.year, data.from.month, 1);
	});

	$effect(() => {
		const { year, month } = placeholder;

		const href = resolve('/events/[[year]]/[[month]]', {
			year: String(year),
			month: String(month).padStart(2, '0'),
		});

		if (window.location.pathname === href) {
			return;
		}

		void goto(href, { replace: true, reset: false }).catch((error) => {
			console.error('Failed to navigate to calendar month:', error);
			toast.error('Der ausgewählte Monat konnte nicht geladen werden.');
		});
	});

	const timelineDayElements = new SvelteMap<string, HTMLLIElement>();

	const focusTimelineDay = (day: string) => {
		const element = timelineDayElements.get(day);

		if (!element) {
			return;
		}

		element.scrollIntoView({ block: 'start', behavior: 'smooth' });
		element.focus({ preventScroll: true });
	};

	$effect(() => {
		const day = value?.toString();

		if (!day || !eventsPerDay.has(day)) {
			return;
		}

		focusTimelineDay(day);
	});

	let expandedEventId = $state<string | undefined>(undefined);

	$effect(() => {
		const match = /^#event-(\d+)$/.exec(page.url.hash);
		if (!match) return;
		const event = events.find((event) => String(event.id) === match[1]);
		if (!event) return;
		const [year, month, day] = event.acf.date_from.split('-').map(Number);
		value = new CalendarDate(year, month, day);

		let cancelled = false;
		void tick().then(() => {
			if (!cancelled) expandedEventId = match[1];
		});

		return () => {
			cancelled = true;
		};
	});
</script>

<div class="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start">
	<div class="w-fit shrink-0 grow lg:grow-0">
		<Calendar
			type="single"
			bind:value
			bind:placeholder
			class="rounded-lg border shadow-sm [--cell-size:--spacing(16)] md:[--cell-size:--spacing(18)]"
			captionLayout="label"
			locale="de"
		>
			{#snippet day({ day, outsideMonth })}
				<CalendarDay
					class="flex flex-col items-center justify-start p-2 data-selected:bg-primary/10! data-selected:text-primary! data-selected:ring-2 data-selected:ring-primary"
				>
					{day.day}

					{#if !outsideMonth && eventsPerDay.has(day.toString())}
						<span class="mt-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
							{eventsPerDay.get(day.toString())?.length} Events
						</span>
					{/if}
				</CalendarDay>
			{/snippet}
		</Calendar>
	</div>

	<aside class="w-full grow rounded-lg border shadow-sm">
		<div class="border-b px-4 py-5">
			<h1 class="mb-5 text-lg font-semibold">Veranstaltungen</h1>
			<p class="text-xs text-muted-foreground">
				{events.length} Veranstaltungen im {new Date(data.from.year, data.from.month - 1, 1).toLocaleString('de', {
					month: 'long',
					year: 'numeric',
				})}.
			</p>
		</div>

		<div class="max-h-[70vh] w-full overflow-auto px-4 py-5">
			<ol class="space-y-6">
				{#each eventsPerDay.entries() as [day, events] (day)}
					<li
						class="rounded-md border p-3"
						tabindex="-1"
						bind:this={() => timelineDayElements.get(day), (v) => timelineDayElements.set(day, v)}
					>
						<div class="flex items-center justify-between">
							<div>
								<span class="text-3xl font-bold tracking-tight text-primary">
									{new Date(day).getDate()}.
								</span>
								<span class=" text-xl font-bold tracking-tight text-primary">
									{new Date(day).toLocaleString(undefined, { month: 'short' })}
								</span>
							</div>
							<div class="text-xs text-muted-foreground">
								{events.length} Veranstaltung{events.length === 1 ? '' : 'en'}
							</div>
						</div>

						<div class="mt-3 space-y-3">
							<Accordion.Root type="single" class="w-full" bind:value={expandedEventId}>
								{#each events as event (event.id)}
									<Accordion.Item value={String(event.id)}>
										<Accordion.Trigger>
											<div class={{ 'text-primary': expandedEventId === String(event.id) }}>
												<p class={['text-sm', expandedEventId === String(event.id) ? 'font-bold' : 'font-medium']}>
													{@html event.title.rendered}
												</p>
												<EventInfo {event} />
											</div>
										</Accordion.Trigger>
										<Accordion.Content>
											<div class="prose-md prose-a:text-primary prose-a:hover:underline">
												{@html event.content.rendered}
											</div>
										</Accordion.Content>
									</Accordion.Item>
								{/each}
							</Accordion.Root>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</aside>
</div>
