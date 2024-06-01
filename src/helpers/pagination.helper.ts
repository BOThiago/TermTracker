export function getPaginationInfo(
  totalDocs: number,
  page: number,
  perPage: number,
) {
  const totalPages = Math.ceil(totalDocs / perPage);
  const hasNext = page + 1 < totalPages;
  const hasPrev = page > 0;

  return { totalPages, hasNext, hasPrev };
}
