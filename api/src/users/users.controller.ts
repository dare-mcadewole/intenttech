import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AccountRole, type SortDirection } from '@repo/contracts';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile-input.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /**
   * PUBLIC — sole data-collection endpoint (wizard submit).
   * Creates info + contact + address + academics atomically.
   */
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.users.create(dto);
  }

  /** Protected — admin list with pagination + search. */
  @Roles(AccountRole.ADMIN, AccountRole.EDITOR, AccountRole.VIEWER)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: `createdAt:${SortDirection}`,
  ) {
    const direction: SortDirection = sort?.endsWith(':asc') ? 'asc' : 'desc';
    return this.users.findAll(Math.max(1, page), Math.min(100, Math.max(1, limit)), search, direction);
  }

  /** Protected — admin single-profile view (resume, edit prefill, export source). */
  @Roles(AccountRole.ADMIN, AccountRole.EDITOR, AccountRole.VIEWER)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.findOne(id);
  }

  /** Protected — ADMIN + EDITOR. Partial nested update; academics = full replace when present. */
  @Roles(AccountRole.ADMIN, AccountRole.EDITOR)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProfileDto) {
    return this.users.update(id, dto);
  }

  /** Protected — ADMIN only. Hard delete with DB cascade. */
  @Roles(AccountRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.remove(id);
  }
}
