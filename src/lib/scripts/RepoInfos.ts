import { writable } from "svelte/store";
import { sort_info } from "$lib/scripts/SortStore.ts";

let _repo_infos: Array<Object>;
const repo_infos = writable<Object[]>([]);

let sort_col: string;
let sort_ascending: boolean;

sort_info.subscribe((sort_values) => {
  sort_col = sort_values.sort_col;
  sort_ascending = sort_values.sort_descending;
});

export function sortArray(this_col: string) {
  if (this_col === sort_col) {
    sort_ascending = !sort_ascending;
  } else {
    sort_col = this_col;
    sort_ascending = true;
  }

  sort_info.set({
    sort_col: sort_col,
    sort_descending: sort_ascending,
  });

  function compareElements(a: Object, b: Object) {
    const A = a[this_col as keyof Object];
    const B = b[this_col as keyof Object];

    if (A < B) {
      return sort_ascending === true ? -1 : 1;
    } else if (A > B) {
      return sort_ascending === true ? 1 : -1;
    }

    return 0;
  }

  repo_infos.subscribe((value) => {
    _repo_infos = value;
  });

  if (_repo_infos !== undefined) {
    repo_infos.set(_repo_infos.sort(compareElements));
  }
}

export { repo_infos };