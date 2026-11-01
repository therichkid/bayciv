<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import Form from '$lib/components/form.svelte';
	import ImageLightbox from '$lib/components/image-lightbox.svelte';
	import { decodeHtml } from '$lib/utils/html';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let page = $derived(data.page);
	let title = $derived(decodeHtml(page.title.rendered));

	let pageContainer: HTMLDivElement | null = $state(null);
</script>

<svelte:head>
	<title>{title} - BayCIV</title>
</svelte:head>

{#if page}
	<h1 class="mt-12 mb-8 text-3xl font-semibold">{title}</h1>
	{#key page.content.rendered}
		<div class="prose-md max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={pageContainer}>
			{@html page.content.rendered}
		</div>

		{#if page.acf.form_id}
			<div class="mt-12">
				<Form formId={page.acf.form_id} pageId={page.id} />
			</div>
		{/if}
		<div></div>
	{/key}
{/if}

<div class="mt-8">
	<BackButton />
</div>

<ImageLightbox html={pageContainer} />
