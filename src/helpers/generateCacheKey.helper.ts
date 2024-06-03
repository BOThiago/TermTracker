import { Request } from 'express';

export function generateCacheKey(request: Request): string {
  const queryParams = request.query as Record<string, string | string[]>;
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, val));
    } else {
      searchParams.append(key, value);
    }
  }

  const queryString = searchParams.toString();

  return queryString
    ? `${request.method}-${request.url}?${queryString}`
    : `${request.method}-${request.url}`;
}
