import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@repo/contracts';
import type {
  AcademicInput,
  AddressInput,
  ContactInput,
  ProfileInfoInput,
} from '@repo/contracts';

export class InfoInputDto implements ProfileInfoInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  occupation!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsUrl({ require_protocol: true })
  profilePhotoUrl?: string | null;
}

export class ContactInputDto implements ContactInput {
  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, { message: 'phoneNumber must be a valid phone number' })
  phoneNumber!: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(30)
  fax?: string | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsUrl({ require_protocol: true })
  linkedinUrl?: string | null;
}

export class AddressInputDto implements AddressInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  addressLine!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  state!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  country!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode!: string;
}

export class AcademicInputDto implements AcademicInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  schoolName!: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(200)
  degree?: string | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(200)
  fieldOfStudy?: string | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(2000)
  description?: string | null;
}

export class CreateProfileDto {
  @ValidateNested()
  @Type(() => InfoInputDto)
  info!: InfoInputDto;

  @ValidateNested()
  @Type(() => ContactInputDto)
  contact!: ContactInputDto;

  @ValidateNested()
  @Type(() => AddressInputDto)
  address!: AddressInputDto;

  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AcademicInputDto)
  academics!: AcademicInputDto[];
}

export class UpdateProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => InfoInputDto)
  info?: InfoInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInputDto)
  contact?: ContactInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInputDto)
  address?: AddressInputDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AcademicInputDto)
  academics?: AcademicInputDto[];
}
