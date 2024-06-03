import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { performance } from 'perf_hooks';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(cacheManager: any, reflector: Reflector) {
    super(cacheManager, reflector);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    const start = performance.now();
    const key = this.trackBy(context);
    const route = this.trackBy(context);

    if (!key || !route) {
      return next.handle().pipe(
        tap(() => {
          const end = performance.now();
          response.setHeader('x-cache', 'MISS');
          response.setHeader(
            'x-response-time',
            `${(end - start).toFixed(2)}ms`,
          );
        }),
      );
    }

    try {
      const value = await this.cacheManager.get(key);

      if (value) {
        const end = performance.now();
        response.setHeader('x-cache', 'HIT');
        response.setHeader('x-response-time', `${(end - start).toFixed(2)}ms`);
        return of(value);
      }

      return next.handle().pipe(
        tap(async (data) => {
          const end = performance.now();
          response.setHeader('x-cache', 'MISS');
          response.setHeader(
            'x-response-time',
            `${(end - start).toFixed(2)}ms`,
          );
          await this.cacheManager.set(key, data, 60 * 60 * 24);
        }),
      );
    } catch (err) {
      return next.handle().pipe(
        tap(() => {
          const end = performance.now();
          response.setHeader('x-cache', 'MISS');
          response.setHeader(
            'x-response-time',
            `${(end - start).toFixed(2)}ms`,
          );
        }),
      );
    }
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths: string[] = [];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes(httpAdapter.getRequestUrl(request)))
    ) {
      return undefined;
    }

    const url = httpAdapter.getRequestUrl(request);
    const queryParams = request.query;
    const queryString = new URLSearchParams(queryParams).toString();

    // Combina a URL, o método da requisição e a string de consulta
    return queryString
      ? `${request.method}-${url}?${queryString}`
      : `${request.method}-${url}`;
  }
}
