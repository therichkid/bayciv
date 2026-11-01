<script lang="ts">
	import type { WP_REST_API_Event } from '#lib/models/wordpress.js';
	import { getAddressString } from '#lib/utils/address.js';
	import { getGroupNames } from '#lib/utils/shg.js';
	import { resolve } from '$app/paths';
	import { ArrowRight, Clock, MapPin, Users } from '@lucide/svelte';

	let { events }: { events: WP_REST_API_Event[] } = $props();
</script>

<ol class="divide-y rounded-lg border">
	{#each events as event (event.id)}
		{@const groupNames = getGroupNames(event._embedded?.['wp:term'])}
		{@const date = new Date(`${event.acf.date_from}T00:00:00`)}
		{@const address = getAddressString(event.acf.address, event.acf.address_name)}

		<li>
			<a
				href="{resolve('/events/[[year]]/[[month]]', {
					year: event.acf.date_from.slice(0, 4),
					month: event.acf.date_from.slice(5, 7),
				})}#event-{event.id}"
				class="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
			>
				<time datetime={event.acf.date_from} class="w-14 shrink-0 text-center text-primary">
					<span class="block text-2xl leading-none font-bold">{date.getDate()}.</span>
					<span class="block text-sm font-medium">{date.toLocaleString('de-DE', { month: 'short' })}</span>
					{#if date.getFullYear() !== new Date().getFullYear()}
						<span class="block text-xs">{date.getFullYear()}</span>
					{/if}
				</time>
				<div class="min-w-0 flex-1">
					<p class="font-semibold group-hover:text-primary">{@html event.title.rendered}</p>
					<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
						{#if groupNames.length > 0}
							<span class="flex items-center gap-1">
								<Users size={15} aria-hidden="true" />
								<span>{groupNames.join(', ')}</span>
							</span>
						{/if}
						{#if event.acf.time_from}
							<span class="flex items-center gap-1">
								<Clock size={15} aria-hidden="true" />
								{event.acf.time_from}{event.acf.time_to ? ` – ${event.acf.time_to}` : ''} Uhr
							</span>
						{/if}
						{#if address}
							<span class="flex items-center gap-1">
								<MapPin size={15} class="shrink-0" aria-hidden="true" />
								{address}
							</span>
						{/if}
					</div>
				</div>
				<ArrowRight size={18} class="shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
			</a>
		</li>
	{/each}
</ol>
