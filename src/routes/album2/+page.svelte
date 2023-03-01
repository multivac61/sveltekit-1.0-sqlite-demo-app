<script lang="ts">
	const default_columns = ['Name', 'Email', 'Phone Number'];
	let data = [
			['John', 'john@example.com', '(353) 01 222 3333'],
			['Mark', 'mark@gmail.com', '(01) 22 888 4444'],
			['Eoin', 'eoin@gmail.com', '0097 22 654 00033'],
			['Sarah', 'sarahcdd@gmail.com', '+322 876 1233'],
			['Afshin', 'afshin@mail.com', '(353) 22 87 8356']
		],
		new_row = [...default_columns];

	function add_row() {
		data = [...data, [...new_row]];
		new_row = [...default_columns];
	}

	function delete_row(row_to_delete: string[]) {
		data = data.filter((row) => row != row_to_delete);
	}
</script>

<table class="table mt-6">
	<tr>
		{#each default_columns as column}
			<th>{column}</th>
		{/each}
	</tr>

	{#each data as row}
		<tr>
			{#each row as cell}
				<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
			<td> <button on:click={() => delete_row(row)}> X </button> </td>
		</tr>
	{/each}

	<tr class="new">
		{#each new_row as column, i}
			<td
				contenteditable="true"
				on:focus={() => {
					column = column === default_columns[i] ? '' : column;
				}}
				on:focusout={() => {
					column = column === '' ? default_columns[i] : column;
				}}
				bind:innerHTML={column}
			/>
		{/each}
		<td> <button on:click={add_row}> add </button> </td>
	</tr>
</table>

<style>
	button {
		display: block;
		margin: auto;
	}
	.new {
		color: grey;
	}
	.new td:focus {
		color: black;
	}
</style>
