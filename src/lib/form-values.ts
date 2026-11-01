import type { WP_REST_API_Form_Element } from './models/wordpress';

export function getEmptyFormData(elements: WP_REST_API_Form_Element[]) {
	return elements.reduce<Record<string, unknown>>((data, element) => {
		if (element.type === 'text_block' || element.type === 'submit') return data;
		if (element.type === 'checkbox' || element.type === 'acceptance') {
			data[element.name] = new Array(element.options?.length || 0).fill(false);
		} else if (element.type === 'file') {
			data[element.name] = undefined;
		} else if (element.type === 'number') {
			data[element.name] = element.default_value ? Number(element.default_value) : undefined;
		} else if (element.type === 'quiz') {
			data[element.name] = element.default_value ?? '';
		} else if (element.multiple) {
			data[element.name] = element.default_value ? [element.default_value] : [];
		} else {
			data[element.name] = element.default_value ?? '';
		}
		return data;
	}, {});
}
