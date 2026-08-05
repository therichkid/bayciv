<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import type { Custom_WP_REST_API_Post } from '$lib/models/wordpress';
	import { getGroupNames } from '$lib/utils/shg';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		post: Custom_WP_REST_API_Post;
	}

	let { post }: Props = $props();

	let featuredMedia = $derived(post._embedded?.['wp:featuredmedia']?.[0]);
	let groupNames = $derived(getGroupNames(post._embedded?.['wp:term']));
</script>

<a href={resolve(`/news/${post.slug}`)}>
	<Card.Root class="h-full p-0 transition duration-300 hover:scale-[1.02] hover:shadow-lg">
		<div class="relative h-48 w-full overflow-hidden rounded-t-lg">
			{#if groupNames.length > 0}
				<div class="absolute top-3 left-3 flex flex-wrap gap-1">
					{#each groupNames as groupName, i (i)}
						<span
							class="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm backdrop-blur-sm"
						>
							{groupName}
						</span>
					{/each}
				</div>
			{/if}
			<img
				src={featuredMedia?.media_details?.sizes?.medium?.source_url || featuredMedia?.source_url}
				alt={featuredMedia?.alt_text || featuredMedia?.caption.rendered || post.title.rendered}
				class="h-full w-full object-cover"
			/>
		</div>

		<Card.Content class="px-4">
			<Card.Title title={post.title.rendered} class="mb-2 line-clamp-2 text-lg font-semibold">
				{@html post.title.rendered}
			</Card.Title>

			<Card.Description class="text-muted-foreground">
				<p class="mb-2 text-xs">
					{new Date(post.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
					· von {post.acf.abweichender_autor || post._embedded.author[0].name}
				</p>

				<p class="line-clamp-5 text-sm">
					{@html post.excerpt.rendered}
				</p>
			</Card.Description>
		</Card.Content>

		<Card.Footer class="mt-auto p-4">
			<span class="ml-auto text-sm font-medium text-primary"> Weiterlesen → </span>
		</Card.Footer>
	</Card.Root>
</a>
