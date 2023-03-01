<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let timer: NodeJS.Timeout,
		searchTerm = '',
		tracks = data.tracks;

	function fetchTracks() {
		fetch(`/api/searchTracks?searchTerm=${searchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
			});
	}

	function handleSearch(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			searchTerm = target.value;
			fetchTracks();
		}, 300);
	}
</script>

<div class="px-4">
	<h1 class="is-size-1 mb-5">Tracks</h1>

	<input
		type="search"
		placeholder="Search..."
		class="input mb-5"
		style="max-width: 80ch;"
		value={searchTerm}
		on:keyup={handleSearch}
	/>

	<table class="table">
		<thead>
			<tr>
				<th>Track</th>
				<th>Artist</th>
				<th>Album</th>
				<th>Genre</th>
			</tr>
		</thead>
		<tbody>
			{#each tracks as track}
				<tr>
					<td>{track.Name}</td>
					<td>{track.albums?.artists.Name}</td>
					<td><a href={`/album/${track.albums?.AlbumId}`}>{track.albums?.Title}</a></td>
					<td>{track.genres?.Name}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
