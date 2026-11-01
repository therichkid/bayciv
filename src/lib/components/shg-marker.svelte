<script lang="ts">
	import ShgCard from '#lib/components/shg-card.svelte';
	import type { WP_REST_API_SHG } from '#lib/models/wordpress.js';
	import { Users } from '@lucide/svelte';
	import { Marker, Popup } from 'svelte-maplibre';

	interface Props {
		shg: WP_REST_API_SHG & { distanceInMeters?: number };
		active?: boolean;
		open?: boolean;
	}

	let { shg, active = false, open = $bindable(false) }: Props = $props();
	let featuredMedia = $derived(shg._embedded?.['wp:featuredmedia']?.[0]);
	let logoUrl = $derived(featuredMedia?.media_details?.sizes?.thumbnail?.source_url || featuredMedia?.source_url);
	let failedLogoUrl = $state<string | undefined>();
</script>

{#if shg.acf.address}
	<Marker
		lngLat={[shg.acf.address.lng, shg.acf.address.lat]}
		anchor="bottom"
		asButton
		class="hover:z-20 {active ? 'z-15' : 'z-10'}"
	>
		<div class="flex flex-col items-center {active ? 'animate-bounce motion-reduce:animate-none' : ''}">
			<div class="flex h-12 w-12 items-center justify-center rounded-lg border-3 border-primary bg-white shadow-lg">
				{#if logoUrl && logoUrl !== failedLogoUrl}
					<img
						src={logoUrl}
						alt={`Logo der Selbsthilfegruppe ${shg.title.rendered}`}
						class="h-full w-full rounded-lg object-contain"
						onerror={() => (failedLogoUrl = logoUrl)}
					/>
				{:else}
					<Users class="h-6 w-6 text-primary" aria-hidden="true" />
				{/if}
			</div>
			<div class="h-0 w-0 border-x-10 border-t-12 border-x-transparent border-t-primary"></div>
		</div>
		<span class="sr-only">{@html shg.title.rendered}</span>

		<Popup
			bind:open
			offset={[0, -54]}
			popupClass="map-popup-content:p-0! map-popup-content:shadow-none! map-popup-content:bg-transparent!"
		>
			<ShgCard {shg} class="max-w-150 animate-none" />
		</Popup>
	</Marker>
{/if}
