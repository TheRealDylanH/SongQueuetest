<script>
	import Search from "./components/Search.svelte";
	import SongList from "./components/SongList.svelte";
	import Queue from "./components/Queue.svelte";
	import { search, selection } from "./stores";
	import { songListMaster } from "./data";
	import { onMount , afterUpdate} from "svelte";
	

	import wretch from "wretch";

	const API = wretch().url("http://localhost:3000/api");

	// songs to display in the left list
	let songs = [];

	// songs to display in the right list
	let queued = [];

	$: {
	$search; // watch search changes
	queued; // watch queue changes
	// filter songs with tokenized search
	const items = $search.split(" ").filter((a) => !!a.trim()).map(t => t.toLowerCase());
	if (items.length > 0) {
	songs = songListMaster.filter((s) => {
	const matchArtist = items.some((t) => s.artist?.toLowerCase()?.includes(t));
	const matchTitle = items.some((t) => s.title?.toLowerCase()?.includes(t));
	return matchArtist || matchTitle;
	});
	} else {
	songs = songListMaster;
	}

	// remove right list from left list
	songs = songs.filter(
	(s) => !queued.some((q) => q.artist === s.artist && q.title === s.title)
    );
  }

  $:  {
    // watch selection events
    const sel = $selection;
    if (sel.artist && sel.title) {
      // try to add to queue, avoid dupes
      const dup = queued.some(
        (q) => q.artist === sel.artist && q.title === sel.title
      );
      
      if (!dup) {
        queued = queued.concat(sel);
		// successful add - save
		updateQueue(sel)
      }
    }
  }

	async function updateQueue(song){
		var response = await API.url('/v1/queue').post(song)
		loadQueue()
	}

	async function loadQueue(){
    	queued = await API.url(`/v1/queue`).get().json()
	}

  	// init
	onMount(loadQueue);

</script>

<div class="headerContainer">
	<h1 class="headerTitle">Song Requests</h1>
	<p class="headerP">Below is a list of all of the songs I can currently play! If there is something on there you would like to hear, simply tap the song and it will be entered into the queue!</p>
	<p class="headerP">It is a long list, so feel free to take the tablet to your seat and return it when you're done so that others can use it!</p>
	<p class="headerP">If there's a song you want to hear that's not on that list, let me know and I can TRY to play it or learn it for a future gig!</p>
</div>

<div class="bodyContainerWrapper">
<div class="bodyContainer">
  
	<div class="container lhContainer">
	    <div class="songHeader">
		    <h4 class="listTitle">Song List</h4>
		     <Search />
	    </div>
		
		<div class="queueHeader">
		    <h4  class="listTitleQ">Queue</h4>
		</div>
		
	</div>
	
  <div class="container">
	   
    <div class="child">
		
      <SongList {songs} />
    </div>
	  
    <div class="child">
      <Queue songs={queued} />
    </div>
  </div>
</div>
</div>
<div class="footerContainer">
	<h2 class="footerHeader">I hope that you find this little piece of software helpful! I'll be making changes to this as I go, so any feedback on your experience is greatly appreciated!</h2>
</div>


<style>

	.container {
	  display: flex;
	}
  
	.container > .child {
	  width: 50%;
	  padding: 5px;
	  outline: 1px solid black;
	  margin: 5px;
	  max-height: 500px;
	  overflow-y: auto;
	}
  </style>
  