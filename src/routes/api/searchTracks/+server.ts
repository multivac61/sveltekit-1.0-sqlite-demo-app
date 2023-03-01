import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET = (async ({ url }) => {
	const searchTerm = url.searchParams.get('searchTerm')?.toString();

	const tracks = await prisma.tracks.findMany({
		where: {
			OR: [
				{
					Name: {
						contains: searchTerm
					}
				},
				{
					albums: {
						Title: {
							contains: searchTerm
						}
					}
				},
				{
					albums: {
						artists: {
							Name: {
								contains: searchTerm
							}
						}
					}
				}
			]
		},
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
	return json(tracks);
}) satisfies RequestHandler;
