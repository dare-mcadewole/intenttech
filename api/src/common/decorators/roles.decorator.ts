import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '@repo/contracts';

export const ROLES_KEY = 'roles';

/** Restricts a route to the given account roles. Requires JWT guard to run first. */
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);
