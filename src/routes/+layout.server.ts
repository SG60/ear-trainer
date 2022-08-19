import { getAllPageHrefs } from '$lib/pageImportUtils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		pages: getAllPageHrefs()
	};
};
