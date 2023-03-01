import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";

export const load = (async () => {
	const albumId = 1;

	if (!albumId) {
		throw error(404, 'Album ID invalid');
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
			}
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
			genres: true
		},
		orderBy: {
			TrackId: 'asc'
		}
	});

	if (!tracks) {
		throw error(404, 'No tracks found on album');
	}

	const genres = await prisma.genres.findMany()

	if (!genres) {
		throw error(404, 'No genres found');
	}

	return {
		album,
		tracks,
		genres
	};
}) satisfies PageServerLoad;