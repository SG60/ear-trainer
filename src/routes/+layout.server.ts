import { getAllPageHrefs } from '$lib/pageImportUtils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		pages: getAllPageHrefs()
	};
};

export const prerender = true;
