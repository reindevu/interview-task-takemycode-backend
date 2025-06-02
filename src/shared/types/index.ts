export interface AppState {
  list: Item[];
  sortOrder: "asc" | "desc";
  checkedIds: number[];
}

export interface Item {
  id: number;
  name: string;
  order: number;
}