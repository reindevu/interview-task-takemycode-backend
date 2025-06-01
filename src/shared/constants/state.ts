import { Item } from "../types";

export let state: Item[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Элемент ${i + 1}`,
  order: i + 1,
}));