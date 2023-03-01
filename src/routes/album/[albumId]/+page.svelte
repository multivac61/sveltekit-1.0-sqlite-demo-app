<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ album, tracks } = data);

	let uploadedImage: string;

	const convert = (ms: number) => {
		const seconds = Math.floor((ms / 1000) % 60);
		const minutes = Math.floor((ms / (1000 * 60)) % 60);
		const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

		return `${hours ? `${hours}:` : ''}${minutes}:${seconds}`;
	};

	function handleImageUpload(e: Event) {
		const image = (e.target as HTMLInputElement)?.files?.[0];
		if (!image) return;
		uploadedImage = URL.createObjectURL(image);
	}
</script>

<div class="px-4">
	<div class="columns">
		<div class="column is-three-quarters">
			<h1 class="is-size-1">{album.Title}</h1>
			<p class="is-size-4">By {album.artists.Name}</p>

			<table class="table mt-6">
				<thead>
					<tr>
						<th>#</th>
						<th>Track</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					{#each tracks as track, i}
						<tr>
							<td>{i + 1}</td>
							<td>{track.Name}</td>
							<td>{convert(track.Milliseconds)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="column">
			<!-- {#if album.imgName}
				<img
					src={`/api/album/${album.albumId}/image/${album.imgName}`}
					alt=""
					class="mt-4 image"
					style="max-width: 250px;"
				/>
			{/if} -->
		</div>
	</div>

	<a href={`/album/${album.AlbumId}/edit-tracks`} class="button is-primary">Edit Tracks</a>

	<h2 class="is-size-3 mb-4 mt-6">Update Album Name</h2>
	<form method="post">
		<input
			class="input"
			type="text"
			name="albumTitle"
			value={album.Title}
			style="max-width: 50ch;"
		/>
		<input type="hidden" name="albumId" value={album.AlbumId} />
		<button class="button is-primary" type="submit" formaction="?/updateAlbumTitle">Update</button>
	</form>

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
