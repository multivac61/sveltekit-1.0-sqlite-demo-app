import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params }) => {
	const albumId = parseInt(params.albumId);

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

export const actions: Actions = {
	updateAlbumTitle: async ({ request }) => {
		const data = await request.formData();

		const albumIdStr = data.get('albumId')?.toString();
		const albumId = albumIdStr ? parseInt(albumIdStr) : null;

		const albumTitle = data.get('albumTitle')?.toString();

		if (!(albumId && albumTitle)) {
			throw error(400, 'AlbumId or AlbumTitle missing');
		}

		await prisma.albums.update({
			where: {
				AlbumId: albumId
			},
			data: {
				Title: albumTitle
			}
		});
	},
	updateAlbumImage: async ({ request }) => {
		const data = await request.formData();

		const albumIdStr = data.get('albumId')?.toString();
		const albumId = albumIdStr ? parseInt(albumIdStr) : null;

		if (!albumId) {
			throw error(400, 'Album ID invalid');
		}

		const albumImage = data.get('albumImage')?.valueOf() as File;
		console.log(
			albumId,
			'albumImage',
			albumImage,
			albumImage?.name,
			albumImage?.type,
			albumImage?.size,
			albumImage?.lastModified
		);

		// mergeAlbumImage(albumId, albumImage);
		// TODO
	}
};
