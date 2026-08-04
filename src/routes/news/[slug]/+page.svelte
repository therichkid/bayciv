<script lang="ts">
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import { decodeHtml } from '$lib/utils/html';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let post = $derived(data.post);
	let title = $derived(decodeHtml(post.title.rendered));

	let articleContainer: HTMLDivElement | null = $state(null);
</script>

<svelte:head>
	<title>{title} - BayCIV</title>
</svelte:head>

{#if post}
	<h1 class="pt-12 pb-8 text-3xl font-semibold">{title}</h1>
	{#key post.content.rendered}
		<div class="prose-md prose max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={articleContainer}>
			{@html post.content.rendered}
		</div>
	{/key}
{/if}

<ImageLightbox html={articleContainer} />
