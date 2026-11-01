<script lang="ts">
	import EventSection from '#lib/components/event-section.svelte';
	import PostList from '#lib/components/post-list.svelte';
</script>

<svelte:head>
	<title>Home - BayCIV</title>
</svelte:head>

<div class="max-w-6xl">
	<h2 class="mt-12 mb-8 text-3xl font-semibold">Neuigkeiten</h2>
	<PostList />

	<h2 class="mt-12 mb-8 text-3xl font-semibold">Veranstaltungen</h2>
	<EventSection />
</div>
