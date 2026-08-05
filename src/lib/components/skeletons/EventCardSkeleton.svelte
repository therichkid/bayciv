<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<Card.Root class="h-full p-0">
	<div class="h-40 w-75 rounded-t-lg">
		<Skeleton class="h-full w-full rounded-none" />
	</div>

	<Card.Header>
		<Skeleton class="h-6 w-full" />
	</Card.Header>

	<Card.Content class="space-y-4 text-sm text-muted-foreground">
		<div class="flex items-center gap-2">
			<Skeleton class="h-5 w-5 rounded-full" />
			<Skeleton class="h-4 w-2/3" />
		</div>

		<div class="flex items-center gap-2">
			<Skeleton class="h-5 w-5 rounded-full" />
			<Skeleton class="h-4 w-1/2" />
		</div>

		<div class="flex items-center gap-2">
			<Skeleton class="h-5 w-5 rounded-full" />
			<div class="flex flex-1 flex-col gap-2">
				<Skeleton class="h-4 w-5/6" />
				<Skeleton class="h-4 w-5/6" />
				<Skeleton class="h-4 w-1/2" />
			</div>
		</div>
	</Card.Content>

	<Card.Footer class="mt-auto p-4">
		<Skeleton class="ml-auto h-4 w-24" />
	</Card.Footer>
</Card.Root>
