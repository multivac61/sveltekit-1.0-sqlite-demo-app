<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { Grid } from 'ag-grid-community';
	import type { GridOptions } from 'ag-grid-community';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';

	export let data: PageData;
	const genreArray = data.genres;
	const deletedIds = new Set();
	let grid: Grid;

	const gridOptions: GridOptions = {
		defaultColDef: {
			sortable: true,
			filter: true,
			flex: 1,
			resizable: true,
			editable: true
		},
		rowSelection: 'multiple',
		columnDefs: [
			{ field: 'TrackId', headerName: 'ID', editable: false, checkboxSelection: true },
			{ field: 'Name', headerName: 'Tracks' },
			{
				field: 'Milliseconds',
				headerName: 'Duration',
				type: 'numericColumn',
				valueFormatter: (params) => (params?.value ? `${params?.value / 1000}` : '')
			},
			{ field: 'Composer', headerName: 'Composer', cellEditor: 'agLargeTextCellEditor' },
			{
				field: 'genre',
				headerName: 'Genre',
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: { values: genreArray.map((genre) => genre.Name).sort() },
				valueFormatter: (params) => {
					return params?.data?.genres?.Name;
				}
			}
		],
		rowData: data.tracks,
		getRowId: (params) => params.data.TrackId
	};

	onMount(() => {
		const gridEl = document.getElementById('myGrid');
		if (!gridEl) {
			throw new Error('Grid element not found');
		}
		grid = new Grid(gridEl, gridOptions);
	});

	let newRows = 0;

	function handleAddRow() {
		newRows++;
		const rowcount = gridOptions.api?.getDisplayedRowCount();
		if (!rowcount) {
			console.error('Grid API not accessible');
			return;
		}

		let maxId = 0;
		gridOptions.api?.forEachNode((rowNode) => {
			if (rowNode.data.TrackId > maxId) maxId = rowNode.data.TrackId;
		});

		const newRow = {
			TrackId: newRows * -1,
			Name: '',
			Milliseconds: '',
			Composer: '',
			genre: data.genres[0]
		};

		gridOptions.api?.applyTransaction({
			add: [newRow],
			addIndex: rowcount
		});

		setTimeout(() => {
			const firstCol = gridOptions.columnApi?.getAllDisplayedColumns()[0];
			gridOptions.api?.ensureColumnVisible(firstCol!);
			gridOptions.api?.ensureIndexVisible(rowcount);
			gridOptions.api?.setFocusedCell(rowcount, firstCol!);
		}, 50);
	}

	function handleDelete() {
		const selectedRowData = gridOptions.api?.getSelectedRows();
		selectedRowData?.forEach(({ TrackId }) => deletedIds.add(TrackId));
		gridOptions.api?.applyTransaction({ remove: selectedRowData });
	}

	let error = false;

	async function handleSave() {
		let rows: any[] = [];
		gridOptions.api?.forEachNode((rowNode) => {
			rows.push(rowNode.data);
		});

		const payload = {
			deleted: Array.from(deletedIds.values()),
			rows
		};

		console.log('payload', payload);

		const res = await fetch(`/api/album/${data.album.AlbumId}/handleTrackGrid`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (res.ok) {
			location.reload();
		} else {
			error = true;
		}
	}
</script>

<div class="px-4">
	<h1 class="is-size-1">Tracks for {data.album.Title}</h1>

	<div class="py-4 columns">
		<div id="myGrid" style="height: 500px;" class="ag-theme-alpine column is-10" />
		<div class="column">
			<div>
				<button class="button" on:click={handleAddRow}>Add Row</button>
			</div>
			<div class="py-2">
				<button class="button" on:click={handleDelete}>Delete Rows</button>
			</div>
			<div class="py-2">
				<button class="button is-primary" on:click={handleSave}>Save changes</button>
			</div>
			{#if error}
				<div class="py-2">
					<div class="notification is-danger">
						<button class="delete" on:click={() => (error = false)} />
						Error saving changes
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
