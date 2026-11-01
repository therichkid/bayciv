<script lang="ts">
	import * as Carousel from '#lib/components/ui/carousel/index.js';
	import type { WP_REST_API_Event } from '#lib/models/wordpress.js';
	import EventCard from './event-card.svelte';

	let { events }: { events: WP_REST_API_Event[] } = $props();
</script>

<Carousel.Root opts={{ align: 'start' }} class="w-full" aria-label="Hauptveranstaltungen">
	<Carousel.Content>
		{#each events as event (event.id)}
			<Carousel.Item class="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
				<div class="h-full p-1.5">
					<EventCard {event} />
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous aria-label="Vorherige Veranstaltung" />
	<Carousel.Next aria-label="Nächste Veranstaltung" />
</Carousel.Root>
