import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  sub: number;
  email: string;
  role: 'admin' | 'tourist';
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);