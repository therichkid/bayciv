<script lang="ts">
	import type { Custom_WP_REST_API_Posts } from '#lib/models/wordpress.js';
	import { getPosts, postState } from '#lib/post.svelte.js';
	import { onMount } from 'svelte';
	import PostCard from './post-card.svelte';
	import PostCardSkeleton from './skeletons/post-card-skeleton.svelte';

	let posts = $state<Custom_WP_REST_API_Posts>([]);

	onMount(async () => {
		const response = await getPosts(1);
		posts = response.posts;
	});
</script>

<div class="my-6 w-full">
	<div class="grid auto-rows-max grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if postState.isLoading && posts?.length === 0}
			{#each Array(8) as _, i (i)}
				<PostCardSkeleton />
			{/each}
		{:else if posts?.length}
			{#each posts as post, i (post.id)}
				{#if i < 8}
					<PostCard {post} />
				{/if}
			{/each}
		{/if}
	</div>
</div>
