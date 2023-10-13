import { ConflictException } from '@nestjs/common';

export class EntityInUse extends ConflictException {
  constructor(entity: string) {
    super(`${entity} is in use on some system resource`);
  }
}
