export interface PaginatedQueryParam {
  limit: number,
  page: number,
}

export type AsyncFunc<T, Res> = (args: T) => Promise<Res>

