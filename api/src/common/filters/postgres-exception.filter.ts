import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Response } from 'express';

/**
 * Maps Postgres unique violations (e.g. duplicate contact email) to 409 Conflict.
 * Everything else delegates to Nest's default exception handling.
 */
@Catch()
export class PostgresExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const code =
      typeof exception === 'object' && exception !== null
        ? (exception as { code?: unknown }).code
        : undefined;
    if (code === '23505') {
      const res = host.switchToHttp().getResponse<Response>();
      return res.status(409).json({
        statusCode: 409,
        message: 'A record with these unique details already exists.',
        error: 'Conflict',
      });
    }
    return super.catch(exception, host);
  }
}
