<script lang="ts">
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
</script>

<div class="divide-y rounded-lg border" role="status" aria-label="Veranstaltungen werden geladen" aria-busy="true">
	{#each Array(3) as _, i (i)}
		<div class="flex items-center gap-4 px-4 py-4 sm:gap-6">
			<div class="flex w-14 shrink-0 flex-col items-center gap-2">
				<Skeleton class="h-6 w-8" />
				<Skeleton class="h-4 w-10" />
			</div>
			<div class="flex min-w-0 flex-1 flex-col gap-2">
				<Skeleton class="h-5 w-3/4" />
				<Skeleton class="h-4 w-1/2" />
			</div>
			<Skeleton class="h-4 w-4 shrink-0" />
		</div>
	{/each}
</div>
