import { IsEmail, IsString, MinLength } from 'class-validator';
import type { LoginRequest } from '@repo/contracts';

export class LoginDto implements LoginRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
