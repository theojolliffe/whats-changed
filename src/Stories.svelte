<script>
	export let items = []
	export let loadedItems = 0;
	function onLoad() {
		loadedItems++
	}
  $: items, loadedItems = 0;
	$: loaded = loadedItems === items.length;
	
	$: console.log(loadedItems, items.length, loaded, items)
</script>

{#if !items || !loaded} 
	Loading... {loadedItems} of {items.length}
{:else}
	{items.length} Slot content loaded
{/if}

<ul>
	{#each items as item, i (item.id)}
		<li class:loaded>
			{#if items || loaded} 
				<slot {item} {onLoad}/>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none; 
		margin: 0; 
		padding: 0; 
		display: flex; 
		flex-wrap: wrap;
	}
	li {
		max-width: 100%; 
		margin: 10px;
		width: calc(50% - 20px);
		opacity: 0;
		transition: opacity 1000ms ease;
	}
	li.loaded {opacity: 1;}
</style>
