/* eslint-disable no-unused-vars */
import pick from 'lodash/pick.js'
import { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

const normalizeKeyPath = (key: string): Array<string> => key
  .replace(/\]/g, '')
  .replace(/\[/g, '.')
  .split('.')
  .filter(Boolean)

const assignNestedValue = (
  target: Record<string, unknown>,
  keyPath: Array<string>,
  value: string,
): void => {
  const path = normalizeKeyPath(keyPath.join('.'))
  if (!path.length) {
    return
  }

  let current: Record<string, unknown> = target

  for (let i = 0; i < path.length - 1; i += 1) {
    const segment = path[i]
    const next = current[segment]

    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      current[segment] = {}
    }

    current = current[segment] as Record<string, unknown>
  }

  const finalKey = path[path.length - 1]
  const existing = current[finalKey]

  if (existing === undefined) {
    current[finalKey] = value
    return
  }

  if (Array.isArray(existing)) {
    existing.push(value)
    return
  }

  current[finalKey] = [existing, value]
}

const parseQueryString = (queryString: string): Record<string, unknown> => {
  const parsed: Record<string, unknown> = {}

  Array.from(new URLSearchParams(queryString).entries()).forEach(([key, value]) => {
    assignNestedValue(parsed, [key], value)
  })

  return parsed
}

const appendQueryValue = (searchParams: URLSearchParams, key: string, value: unknown): void => {
  if (value === undefined || value === null) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => appendQueryValue(searchParams, key, entry))
    return
  }

  if (value instanceof Date) {
    searchParams.append(key, value.toISOString())
    return
  }

  if (typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
      appendQueryValue(searchParams, `${key}.${nestedKey}`, nestedValue)
    })
    return
  }

  searchParams.append(key, String(value))
}

const stringifyQuery = (query: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    appendQueryValue(searchParams, key, value)
  })

  return searchParams.toString()
}

// eslint-disable-next-line no-shadow
export enum QueryParams {
  Tab = 'tab',
  Redirect = 'redirectUrl',
  Refresh = 'refresh',
}

// eslint-disable-next-line no-shadow
export enum QueryListParams {
  Page = 'page',
  SortBy = 'sortBy',
  Direction = 'direction',
  Filters = 'filters',
  Query = 'query',
}

type Params<ParamsT = Record<string, unknown>, FiltersT = Record<string, unknown>> = ParamsT & {
  sortBy: string
  page: string
  tab: string
  redirectUrl: string
  direction: 'asc' | 'desc'
  filters: FiltersT
  refresh: boolean
}

export function useQueryParams<
  ParamsT = Record<string, unknown>,
  FiltersT = Record<string, unknown>,
>() {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const parsedQuery = useMemo(
    () => parseQueryString(searchParams.toString()) as unknown as Params<ParamsT, FiltersT>,
    [searchParams, pathname],
  )
  const { sortBy, direction, page, tab, filters, redirectUrl } = parsedQuery
  const listParams = useMemo(
    () => pick(parsedQuery, [
      QueryListParams.SortBy,
      QueryListParams.Filters,
      QueryListParams.Direction,
      QueryListParams.Page,
      QueryListParams.Query,
    ]),
    [parsedQuery],
  )

  function storeParams(params: Partial<Params<ParamsT, FiltersT>>) {
    setSearchParams(
      stringifyQuery({ sortBy, direction, page, tab, filters, redirectUrl, ...params }),
    )
  }

  function clearParams(...params: string[]) {
    const searchParamsKeys = Array.from(searchParams.keys())
    const clearCandidates = params.length ? params : searchParamsKeys

    for (const param of searchParamsKeys) {
      for (const paramToClear of clearCandidates) {
        if (param.startsWith(paramToClear) && searchParams.get(param)) {
          searchParams.delete(param)
        }
      }
    }

    setSearchParams(searchParams)
  }

  function getParam(param: keyof Params<ParamsT, FiltersT> & string) {
    searchParams.get(param)
  }

  return {
    parsedQuery,
    listParams,
    filters: filters as unknown as FiltersT,
    sortBy,
    direction,
    page,
    tab,
    redirectUrl,
    storeParams,
    clearParams,
    getParam,
  }
}
