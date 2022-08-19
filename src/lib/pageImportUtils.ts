export function getChildPageHrefs(): string[] {
	// Get all child pages
	const modules = import.meta.glob('./**/*.svelte');

	// Format for hrefs
	const pages = Object.keys(modules)
		.filter((el) => !(el === './+page.svelte' || el.includes('+layout')))
		.map((key) => key.replace('./', '').replace('/+page.svelte', ''));

	return pages;
}

export function getAllPageHrefs(): string[] {
	const modules = import.meta.glob('/src/routes/**/*.svelte');
	const pages = Object.keys(modules)
		.filter((el) => !el.includes('+layout'))
		.map((key) => key.replace('/src/routes', '').replace('+page.svelte', ''));
	return pages;
}
