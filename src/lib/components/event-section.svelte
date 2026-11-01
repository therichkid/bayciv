<script lang="ts">
	import { getEvents } from '#lib/event.svelte.js';
	import type { WP_REST_API_Event } from '#lib/models/wordpress.js';

	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import EventCarousel from './event-carousel.svelte';
	import EventList from './event-list.svelte';
	import EventCardSkeleton from './skeletons/event-card-skeleton.svelte';
	import EventListSkeleton from './skeletons/event-list-skeleton.svelte';

	let mainEvents = $state<WP_REST_API_Event[]>([]);
	let regularEvents = $state<WP_REST_API_Event[]>([]);
	let loading = $state(true);
	let failed = $state(false);

	onMount(() => {
		let cancelled = false;

		const loadEvents = async () => {
			const from = new SvelteDate();
			const [main, regular] = await Promise.allSettled([
				getEvents(from, undefined, 1, true),
				getEvents(from, undefined, 1, false),
			]);
			if (cancelled) return;

			if (main.status === 'fulfilled') mainEvents = main.value.events;
			if (regular.status === 'fulfilled') regularEvents = regular.value.events;
			failed = main.status === 'rejected' || regular.status === 'rejected';
			loading = false;
		};

		void loadEvents();
		return () => {
			cancelled = true;
		};
	});
</script>

{#if loading || mainEvents.length > 0}
	<section aria-labelledby="main-events-heading" class="mb-10">
		<h3 id="main-events-heading" class="mb-4 text-xl font-semibold">Hauptveranstaltungen</h3>
		{#if loading}
			<div
				class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				role="status"
				aria-label="Hauptveranstaltungen werden geladen"
				aria-busy="true"
			>
				{#each ['', 'hidden sm:block', 'hidden lg:block', 'hidden xl:block'] as visibility, i (i)}
					<div class={visibility}><EventCardSkeleton /></div>
				{/each}
			</div>
		{:else}
			<EventCarousel events={mainEvents} />
		{/if}
	</section>
{/if}

<section aria-labelledby="upcoming-events-heading">
	<div class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
		<h3 id="upcoming-events-heading" class="text-xl font-semibold">Kommende Veranstaltungen</h3>
		<a href={resolve('/events/[[year]]/[[month]]', {})} class="text-sm font-medium text-primary hover:underline">
			Alle Veranstaltungen →
		</a>
	</div>

	{#if failed}
		<p role="alert" class="mb-4 text-sm text-muted-foreground">
			Die Veranstaltungen konnten nicht vollständig geladen werden. Bitte versuchen Sie es später erneut.
		</p>
	{/if}

	{#if regularEvents.length > 0}
		<EventList events={regularEvents.slice(0, 6)} />
	{:else if loading}
		<EventListSkeleton />
	{:else if !failed}
		<p class="text-sm text-muted-foreground">Derzeit sind keine weiteren Veranstaltungen angekündigt.</p>
	{/if}
</section>
