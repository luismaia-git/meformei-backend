import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsHHMMFormatConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    // Use uma expressão regular para verificar o formato "HH:mm"
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  }
}

export function IsHHMMFormat(validationOptions?: ValidationOptions) {
  return (object: NonNullable<unknown>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsHHMMFormatConstraint,
    });
  };
}
