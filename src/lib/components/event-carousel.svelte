<script lang="ts">
	import * as Carousel from '#lib/components/ui/carousel/index.js';
	import { eventState, getEvents } from '#lib/event.svelte.js';
	import type { WP_REST_API_Event } from '#lib/models/wordpress.js';
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import EventCard from './event-card.svelte';
	import EventCardSkeleton from './skeletons/event-card-skeleton.svelte';

	let events = $state<WP_REST_API_Event[]>([]);

	onMount(async () => {
		const response = await getEvents(new SvelteDate());
		events = response.events;
	});
</script>

{#key events.length > 0}
	<div class="my-6 flex justify-center">
		<Carousel.Root
			opts={{
				align: 'start',
			}}
			class="max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
		>
			<Carousel.Content>
				{#if eventState.isLoading && events.length === 0}
					{#each Array(4) as _, i (i)}
						<Carousel.Item class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<div class="h-full p-1.5">
								<EventCardSkeleton />
							</div>
						</Carousel.Item>
					{/each}
				{:else if events.length > 0}
					{#each events as event (event.id)}
						<Carousel.Item class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<div class="h-full p-1.5">
								<EventCard {event} />
							</div>
						</Carousel.Item>
					{/each}
				{/if}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
{/key}
