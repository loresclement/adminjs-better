import { DELIMITER } from './constants.js'
import { selectParams } from './select-params.js'
import { filterOutParams } from './filter-out-params.js'
import { set } from './set.js'
import { get } from './get.js'
import { merge } from './merge.js'
import { pathToParts } from './path-to-parts.js'
import { removePath } from './remove-path.js'
import { flatten, unflatten } from './flatten.js'

export type FlatModuleType = {
  flatten: typeof flatten;
  unflatten: typeof unflatten;
  set: typeof set;
  get: typeof get;
  selectParams: typeof selectParams;
  filterOutParams: typeof filterOutParams;
  DELIMITER: typeof DELIMITER;
  pathToParts: typeof pathToParts;
  removePath: typeof removePath;
  merge: typeof merge;
}

/**
 * @module flat
 * @name flat
 * @new in version 3.3
 * @load ./flat.doc.md
 */
export const flat: FlatModuleType = {
  /** Flattens nested objects into dot-delimited parameter keys. */
  flatten,
  /** Reconstructs nested objects from dot-delimited parameter keys. */
  unflatten,

  set,
  get,
  selectParams,
  filterOutParams,
  removePath,
  DELIMITER,
  pathToParts,
  merge,
}
