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
