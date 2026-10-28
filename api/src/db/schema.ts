import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// NOTE: CITEXT for emails is applied in the migration (ALTER COLUMN ... TYPE CITEXT).
// Drizzle declares the column as text(); the migration upgrades it.

export const genderEnum = pgEnum('user_gender_enum', [
  'MALE',
  'FEMALE',
  'OTHER',
  'PREFER_NOT_TO_SAY',
]);

export const accountRoleEnum = pgEnum('account_role_enum', [
  'ADMIN',
  'EDITOR',
  'VIEWER',
]);

export const userInfos = pgTable(
  'user_infos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    dateOfBirth: text('date_of_birth').notNull(), // ISO date string YYYY-MM-DD; checked in app + CHECK
    occupation: text('occupation').notNull(),
    gender: genderEnum('gender').notNull(),
    profilePhotoUrl: text('profile_photo_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('user_infos_created_at_idx').on(t.createdAt.desc()),
    index('user_infos_name_idx').on(t.lastName, t.firstName),
  ],
);

export const userContacts = pgTable('user_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => userInfos.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  phoneNumber: text('phone_number').notNull(),
  fax: text('fax'),
  linkedinUrl: text('linkedin_url'),
});

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => userInfos.id, { onDelete: 'cascade' }),
  addressLine: text('address_line').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  zipCode: text('zip_code').notNull(),
});

export const userAcademics = pgTable(
  'user_academics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => userInfos.id, { onDelete: 'cascade' }),
    schoolName: text('school_name').notNull(),
    degree: text('degree'),
    fieldOfStudy: text('field_of_study'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    description: text('description'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('user_academics_user_sort_idx').on(t.userId, t.sortOrder)],
);

export const authUsers = pgTable('auth_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: accountRoleEnum('role').notNull().default('VIEWER'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userInfoRelations = relations(userInfos, ({ one, many }) => ({
  contact: one(userContacts, {
    fields: [userInfos.id],
    references: [userContacts.userId],
  }),
  address: one(userAddresses, {
    fields: [userInfos.id],
    references: [userAddresses.userId],
  }),
  academics: many(userAcademics),
}));

export const userAcademicsRelations = relations(userAcademics, ({ one }) => ({
  userInfo: one(userInfos, {
    fields: [userAcademics.userId],
    references: [userInfos.id]
  })
}))

export type UserInfoRow = typeof userInfos.$inferSelect;
export type NewUserInfo = typeof userInfos.$inferInsert;
