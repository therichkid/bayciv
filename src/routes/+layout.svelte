<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import BayCivBanner from '$lib/components/images/BayCivBanner.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BayCIV</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Toaster />

	<BayCivBanner />

	<header class="sticky top-0 z-50 flex w-full items-center bg-background">
		<Navigation />
	</header>

	<main class="flex flex-1 justify-center px-12 py-6">
		{@render children()}
	</main>

	<Footer />
</div>
