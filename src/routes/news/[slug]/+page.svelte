<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import { decodeHtml } from '$lib/utils/html';
	import { getGroupNames } from '$lib/utils/shg';
	import { Tag } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let post = $derived(data.post);
	let title = $derived(decodeHtml(post.title.rendered));
	let author = $derived(post.acf.abweichender_autor || post._embedded.author[0].name);
	let groupNames = $derived(getGroupNames(post._embedded?.['wp:term']));
	let featuredMedia = $derived(post._embedded?.['wp:featuredmedia']?.[0]);
	let featuredImageSrc = $derived(
		featuredMedia?.media_details?.sizes?.medium_large?.source_url ??
			featuredMedia?.media_details?.sizes?.medium?.source_url ??
			featuredMedia?.source_url,
	);
	let featuredImageAlt = $derived(featuredMedia?.alt_text ?? featuredMedia?.caption.rendered ?? post.title.rendered);

	let featuredImageContainer: HTMLDivElement | null = $state(null);
	let articleContainer: HTMLDivElement | null = $state(null);
</script>

<svelte:head>
	<title>{title} - BayCIV</title>
</svelte:head>

{#if post}
	<h1 class="mt-6 text-3xl font-semibold">{title}</h1>

	<p class="my-6 inline-flex items-center gap-1.5 text-sm">
		<span>
			{new Date(post.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
		</span>
		<span>·</span>
		<span>von {author}</span>
		{#if groupNames.length > 0}
			<span>·</span>
			<span class="inline-flex items-center gap-1">
				<Tag size={16} />
				<span>{groupNames.join(', ')}</span>
			</span>
		{/if}
	</p>

	{#if featuredMedia && featuredImageSrc}
		<div class="mb-6 max-w-3xl" bind:this={featuredImageContainer}>
			<img src={featuredImageSrc} alt={featuredImageAlt} class="w-full rounded-md object-cover" />
		</div>
	{/if}

	{#key post.content.rendered}
		<div class="prose-md prose max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={articleContainer}>
			{@html post.content.rendered}
		</div>
	{/key}
{/if}

<div class="mt-8">
	<BackButton />
</div>

<ImageLightbox html={[featuredImageContainer, articleContainer]} />
