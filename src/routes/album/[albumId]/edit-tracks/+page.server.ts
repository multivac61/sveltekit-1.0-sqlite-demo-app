import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params }) => {
	const albumId = parseInt(params.albumId);

	if (!albumId) {
		throw error(404, 'Please provide a valid album ID');
	}

	const album = await prisma.albums.findUnique({
		where: {
			AlbumId: albumId
		},
		select: {
			AlbumId: true,
			Title: true,
			artists: {
				select: {
					Name: true
				}
			},
		}
	});

	if (!album) {
		throw error(404, 'Album not found');
	}

	const tracks = await prisma.tracks.findMany({
		where: {
			AlbumId: albumId
		},
		select: {
			TrackId: true,
			Name: true,
			MediaTypeId: true,
			Milliseconds: true,
			Bytes: true,
			Composer: true,
			genres: {
				select: {
					Name: true
				}
			}
		},
		orderBy: {
			TrackId: 'asc'
		}
	});
	
	if (!tracks) {
		throw error(404, 'Tracks not found');
	}

	const genres = await prisma.genres.findMany();
	
	if (!genres) {
		throw error(404, 'Genres not found');
	}

	return {
		album,
		tracks,
		genres
	};
}) satisfies PageServerLoad;
