<script>
	import Warning from "./ui/Warning.svelte";
	import Reports from "./Reports.svelte";
	import Topics from "./Topics.svelte";
	import Words from "./WordsOld.svelte";
	import { Tabs, TabList, TabPanel, Tab } from './tabs/tabs.js';
</script>
<Warning/>
 
<Tabs>
	<TabList>
		<Tab>Area Reports</Tab>
		<Tab>Topic QA</Tab>
		<Tab>Word Selection</Tab>
	</TabList>
	<TabPanel>
		<Words/>
	</TabPanel>
	<TabPanel>	
		<Reports/>
	</TabPanel>
	<TabPanel>
		<Topics/>
	</TabPanel>
</Tabs>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
	:global(body) {
		font-family: 'Open Sans', sans-serif;
		padding: 0px;
		line-height: 2;
		color: #323132;
	}

	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		width: 640px
	}

	h1 {
		font-size: 3em;
		line-height: 1.5;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	div#visph {
		background-color: #afcbd6;
		color: #003C57;
		height: 240px;
		padding: 80px;
		font-size: 3rem;
		font-weight: 600;
	}
	span.back-to-top {
		text-decoration: underline;
		color: #206095;
		cursor: pointer;
	}
	div#sf {
		background-color: #F5F5F6;
		padding: 15px;
		font-size: 1.2rem;
	}
</style>