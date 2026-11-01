<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ChevronLeft } from '@lucide/svelte';

	const goBack = () => {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		goto(resolve('/'));
	};
</script>

<Button variant="outline" onclick={goBack}>
	<ChevronLeft />
	<span class="ml-2">Zurück</span>
</Button>
