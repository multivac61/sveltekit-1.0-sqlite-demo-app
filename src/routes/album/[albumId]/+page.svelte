<script lang="ts">
	import { ms_to_hhmmss } from '$lib/util';
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ album, tracks, genres } = data);
	$: value = album?.Title;

	let uploadedImage: string;

	function handleImageUpload(e: Event) {
		const image = (e.target as HTMLInputElement)?.files?.[0];
		if (!image) return;
		uploadedImage = URL.createObjectURL(image);
	}

	function deleteRow(id: number) {
		// TODO
	}
</script>

<!-- {JSON.stringify(genres)} -->

<div class="px-4">
	<div class="columns">
		<div class="column is-three-quarters">
			<h1 contenteditable="true" class="is-size-3 mb-4 mt-6" bind:innerHTML={album.Title} />
			<p class="is-size-4">
				By <span contenteditable="true" class="mb-4 mt-6" bind:innerHTML={album.artists.Name} />
			</p>

			<table class="table mt-6">
				<thead>
					<tr>
						<th>#</th>
						<th>Track</th>
						<th>Duration</th>
						<th>Genre</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{#each tracks as track, i}
						<tr>
							<td>{i + 1}</td>
							<td contenteditable="true" bind:innerHTML={track.Name} />
							<td>
								<!-- Move from hh:mm:ss to Milliseconds -->
								<input name="Milliseconds" value={ms_to_hhmmss(track.Milliseconds)} />
							</td>
							<!-- <td contenteditable=true bind:innerHTML={track.Milliseconds} /> -->
							<!-- <td contenteditable="true" bind:innerHTML={track.genres?.Name} /> -->
							<td>
								<button
									on:click={() => deleteRow(track.TrackId)}
									style="display:block; margin: auto;"
								>
									x
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<!-- <div class="column">
			{#if album.imgName}
				<img
					src={`/api/album/${album.albumId}/image/${album.imgName}`}
					alt=""
					class="mt-4 image"
					style="max-width: 250px;"
				/>
			{/if}
		</div> -->
	</div>

	<a href={`/album/${album.AlbumId}/edit-tracks`} class="button is-primary">Save changes</a>

	<h2 class="is-size-3 mb-4 mt-6">Update Album Image</h2>
	<form method="post" enctype="multipart/form-data">
		<input type="hidden" name="albumId" value={album.AlbumId} />
		<input type="file" name="albumImage" accept="image/*" on:change={handleImageUpload} />

		{#if uploadedImage}
			<div class="mt-4">
				<img src={uploadedImage} style="max-width: 50ch;" alt="" />
			</div>
		{/if}

		<div class="mt-4 mb-6">
			<button
				class="button is-primary is-disabled"
				type="submit"
				formaction="?/updateAlbumImage"
				disabled={!uploadedImage ?? null}
				>Upload Image
			</button>
		</div>
	</form>
</div>
