import { describe, expect, it } from 'vitest';
import { buildFormSchema } from './form-schema';
import { getEmptyFormData } from './form-values';
import type { WP_REST_API_Form, WP_REST_API_Form_Field } from './models/wordpress';

function schemaFor(overrides: Partial<WP_REST_API_Form_Field>) {
	const field: WP_REST_API_Form_Field = {
		type: 'text',
		name: 'field',
		label: 'Field',
		required: true,
		options: [],
		multiple: false,
		default_value: null,
		min: null,
		max: null,
		raw_content: '',
		...overrides,
	};
	return buildFormSchema({ id: 1, title: 'Test', elements: [field] } satisfies WP_REST_API_Form);
}

describe('form validation', () => {
	it('accepts zero and negative numbers when there is no minimum', () => {
		const schema = schemaFor({ type: 'number' });
		expect(schema.safeParse({ field: 0 }).success).toBe(true);
		expect(schema.safeParse({ field: -2 }).success).toBe(true);
		expect(schema.safeParse({ field: undefined }).success).toBe(false);
	});

	it('enforces explicit numeric bounds, including zero', () => {
		const schema = schemaFor({ type: 'number', min: 0, max: 0 });
		expect(schema.safeParse({ field: 0 }).success).toBe(true);
		expect(schema.safeParse({ field: -1 }).success).toBe(false);
		expect(schema.safeParse({ field: 1 }).success).toBe(false);
	});

	it('validates a quiz answer as text', () => {
		const schema = schemaFor({ type: 'quiz' });
		expect(schema.safeParse({ field: 'answer' }).success).toBe(true);
		expect(schema.safeParse({ field: '' }).success).toBe(false);
	});

	it('initializes quiz answers and numeric defaults with the types expected by validation', () => {
		const field = (
			type: WP_REST_API_Form_Field['type'],
			default_value: string | null = null,
		): WP_REST_API_Form_Field => ({
			type,
			name: type,
			label: null,
			required: true,
			options: [],
			multiple: false,
			default_value,
			min: null,
			max: null,
			raw_content: '',
		});
		expect(getEmptyFormData([field('quiz'), field('number', '0'), field('file')])).toEqual({
			quiz: '',
			number: 0,
			file: undefined,
		});
	});

	it('requires a selected file and permits an empty optional upload', () => {
		const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
		expect(schemaFor({ type: 'file' }).safeParse({ field: file }).success).toBe(true);
		expect(schemaFor({ type: 'file' }).safeParse({ field: undefined }).success).toBe(false);
		expect(schemaFor({ type: 'file', required: false }).safeParse({ field: undefined }).success).toBe(true);
	});
});
