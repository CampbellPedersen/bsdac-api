export type ApiResult<D, E> =
  | {state: 'loading', loading: true}
  | {state: 'loaded', loading: false, data: D};