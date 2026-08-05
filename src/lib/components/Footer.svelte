<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { footerNavigation } from '$lib/navigation';
	import { Separator } from './ui/separator';

	const currentYear = new Date().getFullYear();
</script>

<footer>
	<Separator class="my-4" />

	<div class="my-4 flex flex-col items-center gap-4">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				{#each footerNavigation as item, i (i)}
					{@const href = resolve(item.href!)}
					{@const isActive = page.url.pathname === href}

					<NavigationMenu.Item>
						<NavigationMenu.Link active={isActive}>
							{#snippet child()}
								<a
									{href}
									aria-current={isActive ? 'page' : undefined}
									class={navigationMenuTriggerStyle({ class: isActive ? 'bg-accent text-accent-foreground' : '' })}
								>
									<span class="cursor-pointer">
										{item.title}
									</span>
								</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<p class="text-sm text-muted-foreground">
			© {currentYear} − Bayerischer Cochlea Implantat Verband e.V.
		</p>
	</div>
</footer>
