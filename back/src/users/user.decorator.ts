import { createParamDecorator } from '@nestjs/common';
export interface RequestWithUser extends Request {
  user: { id: string; username: string };
}

export const CurrentUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});
