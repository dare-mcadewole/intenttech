import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as public (skips the global JWT guard). Used for POST /users (public submission) and auth endpoints. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
