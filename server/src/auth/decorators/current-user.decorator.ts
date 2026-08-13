import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return request.user;
  },
);
