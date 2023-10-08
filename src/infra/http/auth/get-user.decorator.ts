import { createParamDecorator } from '@nestjs/common';

type GetUserBody = any

export const GetUser = createParamDecorator((req): GetUserBody => {
  const user = req.args[0].user;
  return user;
});