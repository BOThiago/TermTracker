import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UsuarioIdParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (request['user']) {
      return String(request['user']?.userId);
    }

    return null;
  },
);

export const WordAndUserIdParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): object => {
    const request = ctx.switchToHttp().getRequest();

    if (request['user'] && request['params']['word']) {
      return {
        userId: String(request['user']?.userId),
        word: String(request['params']['word']),
      };
    }

    return null;
  },
);

export const searchParams = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): object => {
    const request = ctx.switchToHttp().getRequest();

    if (request['_parsedUrl']['query']) {
      const params = new URLSearchParams(request['_parsedUrl']['query']);

      return {
        search: params.get('search') ?? '',
        page: params.get('page') ?? 0,
        limit: params.get('limit') ?? 10,
      };
    }

    return {};
  },
);
