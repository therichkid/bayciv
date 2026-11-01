import { afterEach, describe, expect, it, vi } from 'vitest';
import { getShgs, shgState } from './shg.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
	shgState.shgs = [];
	shgState.isLoading = false;
});

describe('self-help group directory', () => {
	it('loads and sorts all WordPress pages', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(JSON.stringify([{ id: 1, title: { rendered: 'Zulu' } }]), { headers: { 'X-WP-TotalPages': '2' } }),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify([{ id: 2, title: { rendered: 'Alpha' } }]), {
					headers: { 'X-WP-TotalPages': '2' },
				}),
			);
		vi.stubGlobal('fetch', fetchMock);

		const groups = await getShgs();
		expect(groups.map((group) => group.title.rendered)).toEqual(['Alpha', 'Zulu']);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(new URL(fetchMock.mock.calls[1][0].toString()).searchParams.get('page')).toBe('2');
	});

	it('does not cache a partial result when a later page fails and permits a retry', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(JSON.stringify([{ id: 1, title: { rendered: 'Zulu' } }]), { headers: { 'X-WP-TotalPages': '2' } }),
			)
			.mockResolvedValueOnce(new Response('error', { status: 500 }))
			.mockResolvedValueOnce(
				new Response(JSON.stringify([{ id: 2, title: { rendered: 'Alpha' } }]), {
					headers: { 'X-WP-TotalPages': '1' },
				}),
			);
		vi.stubGlobal('fetch', fetchMock);

		await expect(getShgs()).rejects.toThrow();
		expect(shgState.shgs).toEqual([]);
		expect(shgState.isLoading).toBe(false);
		expect((await getShgs()).map((group) => group.title.rendered)).toEqual(['Alpha']);
	});
});
