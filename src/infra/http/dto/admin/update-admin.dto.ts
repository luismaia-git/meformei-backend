import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAdminBody } from './create-admin.dto';

export class UpdateAdminBody extends PartialType(
  OmitType(CreateAdminBody, ['password']),
) {}
