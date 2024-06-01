export class PaginatedResult<T> {
  results: T[];
  totalDocs: number;
  perPage: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;

  public static createPagination(pagination: PaginatedResult<any>) {
    return {
      results: pagination.results,
      totalDocs: pagination.totalDocs,
      perPage: pagination.perPage,
      page: pagination.page,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
    };
  }
}
