import { ConflictException } from '@nestjs/common';

export class AtributeAlreadyUsed extends ConflictException {
  constructor(atribute: string) {
    super(`${atribute} already used`);
  }
}
