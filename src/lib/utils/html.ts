export const decodeHtml = (html?: string | null): string => {
	const doc = new DOMParser().parseFromString(html ?? '', 'text/html');
	return doc.documentElement.textContent || '';
};
