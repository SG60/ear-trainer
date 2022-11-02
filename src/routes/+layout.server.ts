import { getAllPageHrefs } from '$lib/pageImportUtils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		pages: ['/', '/account', '/kitchen-sink-demos'].concat(
			getAllPageHrefs().filter((el) => el.startsWith('/exercises'))
		)
	};
};

// export const prerender = true;
