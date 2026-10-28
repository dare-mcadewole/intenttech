import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { asc, count, desc, eq, ilike, inArray, or } from 'drizzle-orm';
import type { ProfileResponse, ProfileSummary } from '@repo/contracts';
import { DB, type Db } from '../db/db.module';
import { userAcademics, userAddresses, userContacts, userInfos } from '../db/schema';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile-input.dto';

function toResponse(row: {
  info: typeof userInfos.$inferSelect;
  contact: typeof userContacts.$inferSelect | undefined;
  address: typeof userAddresses.$inferSelect | undefined;
  academics: (typeof userAcademics.$inferSelect)[];
}): ProfileResponse {
  if (!row.contact) throw new NotFoundException('Contact row missing for user.');
  if (!row.address) throw new NotFoundException('Address row missing for user.');
  return {
    id: row.info.id,
    info: {
      firstName: row.info.firstName,
      lastName: row.info.lastName,
      dateOfBirth: row.info.dateOfBirth,
      occupation: row.info.occupation,
      gender: row.info.gender as ProfileResponse['info']['gender'],
      profilePhotoUrl: row.info.profilePhotoUrl,
      createdAt: row.info.createdAt.toISOString(),
      updatedAt: row.info.updatedAt.toISOString(),
    },
    contact: {
      email: row.contact.email,
      phoneNumber: row.contact.phoneNumber,
      fax: row.contact.fax,
      linkedinUrl: row.contact.linkedinUrl,
    },
    address: {
      addressLine: row.address.addressLine,
      city: row.address.city,
      state: row.address.state,
      country: row.address.country,
      zipCode: row.address.zipCode,
    },
    academics: [...row.academics]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((a) => ({
        id: a.id,
        schoolName: a.schoolName,
        degree: a.degree,
        fieldOfStudy: a.fieldOfStudy,
        startDate: a.startDate,
        endDate: a.endDate,
        description: a.description,
        sortOrder: a.sortOrder,
      })),
  };
}

function assertDateSemantics(
  info?: { dateOfBirth?: string },
  academics?: { startDate?: string | null; endDate?: string | null }[],
) {
  if (info?.dateOfBirth) {
    const dob = new Date(info.dateOfBirth);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) {
      throw new BadRequestException('dateOfBirth must be a valid past date.');
    }
  }
  for (const a of academics ?? []) {
    if (a.startDate && a.endDate && new Date(a.endDate) < new Date(a.startDate)) {
      throw new BadRequestException('Academic endDate must be >= startDate.');
    }
  }
}

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private readonly db: Db) {}

  async create(dto: CreateProfileDto): Promise<ProfileResponse> {
    assertDateSemantics(dto.info, dto.academics);
    return this.db.transaction(async (tx) => {
      const [info] = await tx.insert(userInfos).values({ ...dto.info }).returning();
      const [contact] = await tx
        .insert(userContacts)
        .values({ ...dto.contact, userId: info.id })
        .returning();
      const [address] = await tx
        .insert(userAddresses)
        .values({ ...dto.address, userId: info.id })
        .returning();
      let academics: (typeof userAcademics.$inferSelect)[] = [];
      if (dto.academics.length > 0) {
        academics = await tx
          .insert(userAcademics)
          .values(dto.academics.map((a, i) => ({ ...a, userId: info.id, sortOrder: i })))
          .returning();
      }
      return toResponse({ info, contact, address, academics });
    });
  }

  async findAll(page = 1, limit = 20, search?: string, sort: 'asc' | 'desc' = 'desc') {
    const offset = (page - 1) * limit;
    const order = sort === 'asc' ? asc(userInfos.createdAt) : desc(userInfos.createdAt);
    const term = search?.trim();
    const where = term
      ? or(
          ilike(userInfos.firstName, `%${term}%`),
          ilike(userInfos.lastName, `%${term}%`),
          ilike(userContacts.email, `%${term}%`),
        )
      : undefined;

    const rows = await this.db
      .select({ info: userInfos, contact: userContacts, address: userAddresses })
      .from(userInfos)
      .leftJoin(userContacts, eq(userContacts.userId, userInfos.id))
      .leftJoin(userAddresses, eq(userAddresses.userId, userInfos.id))
      .where(where)
      .orderBy(order)
      .limit(limit)
      .offset(offset);

    const [{ total }] = await this.db
      .select({ total: count() })
      .from(userInfos)
      .leftJoin(userContacts, eq(userContacts.userId, userInfos.id))
      .where(where);

    const ids = rows.map((r) => r.info.id);
    const counts = ids.length
      ? await this.db
          .select({ userId: userAcademics.userId, n: count() })
          .from(userAcademics)
          .where(inArray(userAcademics.userId, ids))
          .groupBy(userAcademics.userId)
      : [];
    const countById = new Map(counts.map((c) => [c.userId, c.n]));

    const data: ProfileSummary[] = rows.map((r) => ({
      ...toResponse({
        info: r.info,
        contact: r.contact ?? undefined,
        address: r.address ?? undefined,
        academics: [],
      }),
      academics: [],
      academicsCount: countById.get(r.info.id) ?? 0,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { data, meta: { page, limit, total, totalPages } };
  }

  async findOne(id: string): Promise<ProfileResponse> {
    const row = await this.db.query.userInfos.findFirst({
      where: eq(userInfos.id, id),
      with: { contact: true, address: true, academics: { orderBy: asc(userAcademics.sortOrder) } },
    });
    if (!row) throw new NotFoundException(`Profile ${id} not found.`);
    return toResponse({
      info: row,
      contact: row.contact ?? undefined,
      address: row.address ?? undefined,
      academics: row.academics,
    });
  }

  async update(id: string, dto: UpdateProfileDto): Promise<ProfileResponse> {
    assertDateSemantics(dto.info, dto.academics);
    await this.findOne(id); // 404 early
    await this.db.transaction(async (tx) => {
      if (dto.info) {
        await tx
          .update(userInfos)
          .set({ ...dto.info, updatedAt: new Date() })
          .where(eq(userInfos.id, id));
      }
      if (dto.contact) {
        await tx
          .insert(userContacts)
          .values({ ...dto.contact, userId: id })
          .onConflictDoUpdate({ target: userContacts.userId, set: { ...dto.contact } });
      }
      if (dto.address) {
        await tx
          .insert(userAddresses)
          .values({ ...dto.address, userId: id })
          .onConflictDoUpdate({ target: userAddresses.userId, set: { ...dto.address } });
      }
      // Full-replace semantics: key present => delete-all + re-insert in order.
      if (dto.academics !== undefined) {
        await tx.delete(userAcademics).where(eq(userAcademics.userId, id));
        if (dto.academics.length > 0) {
          await tx
            .insert(userAcademics)
            .values(dto.academics.map((a, i) => ({ ...a, userId: id, sortOrder: i })));
        }
      }
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ ok: true }> {
    const deleted = await this.db
      .delete(userInfos)
      .where(eq(userInfos.id, id))
      .returning({ id: userInfos.id });
    if (deleted.length === 0) throw new NotFoundException(`Profile ${id} not found.`);
    return { ok: true };
  }
}
