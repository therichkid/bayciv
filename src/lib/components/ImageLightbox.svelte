<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	interface LightboxImage {
		elem: HTMLImageElement;
		index: number;
		handler: ((event: MouseEvent) => void) | null;
	}

	type LightboxContainer = HTMLElement | null;
	type LightboxContainers = LightboxContainer | LightboxContainer[];

	let { html }: { html: LightboxContainers } = $props();

	let images: LightboxImage[] = $state.raw([]);
	let zoomedImage: LightboxImage | null = $state(null);

	const navigate = (direction: -1 | 1) => {
		if (zoomedImage && images.length > 1) {
			zoomedImage = images[(zoomedImage.index + direction + images.length) % images.length];
		}
	};

	const setupImageHandlers = () => {
		const containers = (Array.isArray(html) ? html : [html]).filter(
			(container): container is HTMLElement => container instanceof HTMLElement,
		);

		if (!containers.length) {
			images = [];
			return;
		}

		const uniqueImages = Array.from(
			new Set(containers.flatMap((container) => Array.from(container.querySelectorAll('img')))),
		);

		const nextImages: LightboxImage[] = uniqueImages.map((elem, index) => ({ elem, index, handler: null }));

		nextImages.forEach((image) => {
			if (image.handler) {
				return;
			}

			const handler = (_event: MouseEvent) => (zoomedImage = image);
			image.elem.addEventListener('click', handler);
			image.handler = handler;

			image.elem.classList.add('rounded-sm', 'cursor-pointer', 'transition', 'duration-300', 'hover:scale-[1.02]');
		});

		images = nextImages;
	};

	$effect(() => {
		if (html) {
			setupImageHandlers();
		}
	});
</script>

<Dialog.Root
	open={zoomedImage !== null}
	onOpenChange={(open) => {
		if (!open) {
			// Wait for the dialog close animation to finish
			setTimeout(() => (zoomedImage = null), 100);
		}
	}}
>
	<Dialog.Content class="align-center flex max-h-[90vh] justify-center p-8 sm:max-w-fit">
		{#if zoomedImage}
			<div class="relative flex min-h-0 items-center justify-center">
				<img
					srcset={zoomedImage.elem.srcset}
					src={zoomedImage.elem.src}
					alt={zoomedImage.elem.alt}
					class="max-h-[calc(90vh-4rem)] max-w-full rounded-md object-contain"
				/>
				{#if images.length > 1}
					<Button
						variant="ghost"
						size="icon-lg"
						class="absolute inset-y-0 left-0 h-full w-1/2 justify-start rounded-none text-white opacity-0 hover:bg-transparent hover:text-white hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-transparent [@media(hover:none)]:opacity-100"
						aria-label="Vorheriges Bild"
						onclick={() => navigate(-1)}
					>
						<span aria-hidden="true" class="absolute inset-0 bg-linear-to-r from-black/30 to-transparent"></span>
						<ChevronLeft class="relative size-8" />
					</Button>
					<Button
						variant="ghost"
						size="icon-lg"
						class="absolute inset-y-0 right-0 h-full w-1/2 justify-end rounded-none text-white opacity-0 hover:bg-transparent hover:text-white hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-transparent [@media(hover:none)]:opacity-100"
						aria-label="Nächstes Bild"
						onclick={() => navigate(1)}
					>
						<span aria-hidden="true" class="absolute inset-0 bg-linear-to-l from-black/30 to-transparent"></span>
						<ChevronRight class="relative size-8" />
					</Button>
				{/if}
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
