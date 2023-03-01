import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const tracks = await prisma.tracks.findMany({
		select: {
			Name: true,
			genres: true,
			albums: {
				select: {
					Title: true,
					AlbumId: true,
					artists: {
						select: {
							Name: true
						}
					}
				}
			}
		}
	});
	return {
		tracks
	};
}) satisfies PageServerLoad;
