<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
</script>

<Card.Root class="h-full p-0">
	<div class="h-40 w-75 rounded-t-lg">
		<Skeleton class="h-full w-full rounded-none" />
	</div>

	<Card.Header>
		<div class="space-y-2">
			<Skeleton class="h-6 w-full" />
			<Skeleton class="h-6 w-1/2" />
		</div>
	</Card.Header>

	<Card.Content class="space-y-4 text-sm text-muted-foreground">
		<Skeleton class="h-3 w-3/4" />

		<div class="flex flex-col gap-2">
			<Skeleton class="h-4 w-5/6" />
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-5/6" />
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-1/2" />
		</div>
	</Card.Content>

	<Card.Footer class="mt-auto p-4">
		<Skeleton class="ml-auto h-4 w-24" />
	</Card.Footer>
</Card.Root>
