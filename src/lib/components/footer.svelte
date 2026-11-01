<script lang="ts">
	import FacebookIcon from '#lib/components/images/facebook-icon.svelte';
	import InstagramIcon from '#lib/components/images/instagram-icon.svelte';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '#lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { footerNavigation } from '#lib/navigation.js';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Mail, MapPin, Phone } from '@lucide/svelte';
	import { Separator } from './ui/separator';

	const currentYear = new Date().getFullYear();
</script>

<footer class="mt-8 bg-linear-to-b from-secondary/0 to-secondary/90 text-secondary-foreground">
	<div class="my-8 flex items-start justify-center gap-16 text-sm">
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<MapPin size={22} />
				<p>
					Bayerischer Cochlea Implantat Verband e.V.<br />
					Arberweg 28<br />
					85748 Garching
				</p>
			</div>

			<div class="flex items-center gap-2">
				<Phone size={22} />
				<a href="tel:+498921548528" class="underline">+49 (0) 89 215 48 528</a>
			</div>

			<div class="flex items-center gap-2">
				<Mail size={22} />
				<span>info(at)bayciv.de</span>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<InstagramIcon size={22} />
				<a href="https://www.instagram.com/bayciv" target="_blank" rel="noopener noreferrer" class="underline">
					@bayciv
				</a>
			</div>
			<div class="flex items-center gap-2">
				<FacebookIcon size={22} />
				<a href="https://www.facebook.com/bayciv" target="_blank" rel="noopener noreferrer" class="underline">
					/bayciv
				</a>
			</div>
		</div>
	</div>

	<div class="mx-12 mt-8 mb-4">
		<Separator />
	</div>

	<div class="mb-8 flex flex-col items-center gap-4">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				{#each footerNavigation as item, i (i)}
					{@const isInternalLink = item.href?.startsWith('/') ?? false}
					{@const href = isInternalLink ? resolve(item.href as `/${string}`) : item.href}
					{@const isActive = href && page.url.pathname.startsWith(href)}

					<NavigationMenu.Item>
						<NavigationMenu.Link active={isActive}>
							{#snippet child()}
								<a
									{href}
									target={!isInternalLink ? '_blank' : undefined}
									rel={!isInternalLink ? 'noopener noreferrer' : undefined}
									aria-current={isActive ? 'page' : undefined}
									class={navigationMenuTriggerStyle({ class: isActive ? 'bg-accent text-accent-foreground' : '' })}
								>
									<span class="flex cursor-pointer items-center gap-2">
										{#if item.icon}
											<svelte:component this={item.icon} size={18} />
										{/if}
										{#if item.title}
											{item.title}
										{/if}
									</span>
								</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<p class="text-sm">
			© {currentYear} − Bayerischer Cochlea Implantat Verband e.V.
		</p>
	</div>
</footer>
