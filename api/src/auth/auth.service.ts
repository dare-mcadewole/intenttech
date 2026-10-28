import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountRole } from '@repo/contracts';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DB, type Db } from '../db/db.module';
import { authUsers } from '../db/schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private signPair(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwt.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: Number(this.config.get('JWT_ACCESS_TTL') ?? 900),
      }),
      refreshToken: this.jwt.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: Number(this.config.get('JWT_REFRESH_TTL') ?? 604800),
      }),
    };
  }

  async login(email: string, password: string) {
    const rows = await this.db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email));
    const user = rows[0];
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials.');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials.');
    return {
      user: { id: user.id, email: user.email, role: user.role as AccountRole },
      ...this.signPair(user),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
        role: string;
      }>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      const rows = await this.db
        .select()
        .from(authUsers)
        .where(eq(authUsers.id, payload.sub));
      const user = rows[0];
      if (!user || !user.isActive) throw new UnauthorizedException('Session revoked.');
      return {
        user: { id: user.id, email: user.email, role: user.role as AccountRole },
        ...this.signPair(user),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.email, dto.email));
    if (existing.length > 0) throw new ConflictException('Account email already in use.');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const [created] = await this.db
      .insert(authUsers)
      .values({ email: dto.email, passwordHash, role: dto.role })
      .returning({ id: authUsers.id, email: authUsers.email, role: authUsers.role });
    return { id: created.id, email: created.email, role: created.role as AccountRole };
  }

  async me(userId: string) {
    const rows = await this.db
      .select({ id: authUsers.id, email: authUsers.email, role: authUsers.role })
      .from(authUsers)
      .where(eq(authUsers.id, userId));
    const user = rows[0];
    if (!user) throw new UnauthorizedException('Account not found.');
    return { id: user.id, email: user.email, role: user.role as AccountRole };
  }
}
