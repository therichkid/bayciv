import { getShgs } from '#lib/shg.svelte.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const shgs = await getShgs();

	return { shgs };
};
