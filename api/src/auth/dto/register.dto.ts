import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { AccountRole, type RegisterAccountRequest } from '@repo/contracts';

export class RegisterDto implements RegisterAccountRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(AccountRole)
  role!: AccountRole;
}
