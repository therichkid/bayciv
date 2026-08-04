<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
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
	<h1 class="pt-12 pb-8 text-3xl font-semibold">{title}</h1>
	{#key page.content.rendered}
		<div class="prose-md max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={pageContainer}>
			{@html page.content.rendered}
		</div>

		{#if page.acf.formular_id}
			<div class="mt-12">
				<Form formId={page.acf.formular_id} pageId={page.id} />
			</div>
		{/if}
		<div></div>
	{/key}
{/if}

<ImageLightbox html={pageContainer} />
