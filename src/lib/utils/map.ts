import type { ExpressionInputType, ExpressionSpecification } from 'maplibre-gl';
import type { Map } from 'svelte-maplibre';

export const preferGermanMapLabels = (map: Map) => {
	for (const layer of map.getStyle().layers) {
		if (layer.type !== 'symbol' || layer.source !== 'openmaptiles') continue;

		const textField = layer.layout?.['text-field'];
		if (!textField || !JSON.stringify(textField).includes('"name_en"')) continue;

		map.setLayoutProperty(layer.id, 'text-field', [
			'coalesce',
			['get', 'name:de'],
			['get', 'name_de'],
			textField as ExpressionSpecification | ExpressionInputType,
		]);
	}
};
