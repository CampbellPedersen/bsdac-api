export type ApiResult<D> =
  | {state: 'loading', loading: true}
  | {state: 'loaded', loading: false, data: D};
