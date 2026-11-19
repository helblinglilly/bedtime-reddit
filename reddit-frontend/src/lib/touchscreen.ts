import { createContext } from 'svelte';
import type { Readable } from 'svelte/store';

export const [getTouchscreen, setTouchscreen] = createContext<Readable<boolean>>();
