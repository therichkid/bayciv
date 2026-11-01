import { getPost } from '#lib/post.svelte.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { slug } = params;

	const post = await getPost(slug);

	if (!post) {
		error(404, 'Not found');
	}

	return { post };
};
