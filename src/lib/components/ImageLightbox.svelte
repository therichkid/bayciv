<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	interface LightboxImage {
		elem: HTMLImageElement;
		index: number;
		handler: ((event: MouseEvent) => void) | null;
	}

	type LightboxContainer = HTMLElement | null;
	type LightboxContainers = LightboxContainer | LightboxContainer[];

	let { html }: { html: LightboxContainers } = $props();

	let images: LightboxImage[] = [];
	let zoomedImage: LightboxImage | null = $state(null);

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

		images = uniqueImages.map((elem, index) => ({ elem, index, handler: null }));

		images.forEach((image) => {
			if (image.handler) {
				return;
			}

			const handler = (_event: MouseEvent) => (zoomedImage = image);
			image.elem.addEventListener('click', handler);
			image.handler = handler;

			image.elem.classList.add('rounded-sm', 'cursor-pointer', 'transition', 'duration-300', 'hover:scale-[1.02]');
		});
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
			<img
				srcset={zoomedImage.elem.srcset}
				src={zoomedImage.elem.src}
				alt={zoomedImage.elem.alt}
				class="rounded-md object-contain"
			/>
		{/if}
	</Dialog.Content>
</Dialog.Root>
