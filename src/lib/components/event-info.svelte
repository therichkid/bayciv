<script lang="ts">
	import type { WP_REST_API_Event } from '#lib/models/wordpress.js';
	import { getAddressString } from '#lib/utils/address.js';
	import { getGroupNames } from '#lib/utils/shg.js';
	import { Clock, MapPin, Users } from '@lucide/svelte';

	let { event }: { event: WP_REST_API_Event } = $props();
	let groupNames = $derived(getGroupNames(event._embedded?.['wp:term']));
	let address = $derived(getAddressString(event.acf.address, event.acf.address_name));
</script>

<div class="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
	{#if groupNames.length > 0}
		<span class="flex items-center gap-1">
			<Users size={15} aria-hidden="true" />
			<span>{groupNames.join(', ')}</span>
		</span>
		·
	{/if}
	<span class="flex items-center gap-1">
		<Clock size={15} aria-hidden="true" />
		{event.acf.time_from}{event.acf.time_to ? ` - ${event.acf.time_to}` : ''} Uhr
	</span>
	{#if address}
		·
		<span class="flex items-center gap-1">
			<MapPin size={15} class="shrink-0" aria-hidden="true" />
			{address}
		</span>
	{/if}
</div>
