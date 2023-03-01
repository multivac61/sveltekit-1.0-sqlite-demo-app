import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST = (async ({ request, params }) => {
	if (!params.albumId) {
		throw error(404, {
			message: 'Album not found'
		});
	}

	const albumId = parseInt(params.albumId);
	if (!albumId) {
		throw error(404, { message: 'Album not found' });
	}

	const data = await request.json();
	data.albumId = albumId;

	try {
		if (data.deleted && data.deleted.length > 0) {
			console.log('delete', data.deleted);

			for (const trackId of data.deleted) {
				await prisma.tracks.delete({
					where: {
						TrackId: trackId
					}
				});
			}
		}

		if (data.rows && data.rows.length > 0) {
			console.log('update or create', data.rows);

			for (const track of data.rows) {
				const new_track = {
					Name: track.Name,
					Milliseconds: parseInt(track.Milliseconds),
					Composer: track.Composer,
					AlbumId: albumId
				};
				if (track.TrackId > 0) {
					await prisma.tracks.update({
						where: {
							TrackId: track.TrackId
						},
						data: new_track
					});
				} else {
					await prisma.tracks.create({
						data: {
							...new_track,
							TrackId: track.TrackId,
							MediaTypeId: 1,
							Bytes: 0,
							UnitPrice: 0.99
						}
					});
				}
			}
		}

		return json({ success: true });
	} catch (e) {
		console.log('error saving grid tracks', e);
		throw error(500, 'Error saving grid tracks');
	}
}) satisfies RequestHandler;
