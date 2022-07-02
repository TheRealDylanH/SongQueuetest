import {writable} from "svelte/store";

// search string
export const search = writable("");

// event emitter for song selection
export const selection = writable({});
