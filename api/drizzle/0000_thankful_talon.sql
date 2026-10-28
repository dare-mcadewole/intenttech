CREATE TYPE "public"."account_role_enum" AS ENUM('ADMIN', 'EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."user_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "account_role_enum" DEFAULT 'VIEWER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_academics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"school_name" text NOT NULL,
	"degree" text,
	"field_of_study" text,
	"start_date" text,
	"end_date" text,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address_line" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"zip_code" text NOT NULL,
	CONSTRAINT "user_addresses_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"fax" text,
	"linkedin_url" text,
	CONSTRAINT "user_contacts_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_contacts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_infos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"occupation" text NOT NULL,
	"gender" "user_gender_enum" NOT NULL,
	"profile_photo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_academics" ADD CONSTRAINT "user_academics_user_id_user_infos_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_infos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_user_infos_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_infos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_contacts" ADD CONSTRAINT "user_contacts_user_id_user_infos_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_infos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_academics_user_sort_idx" ON "user_academics" USING btree ("user_id","sort_order");--> statement-breakpoint
CREATE INDEX "user_infos_created_at_idx" ON "user_infos" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "user_infos_name_idx" ON "user_infos" USING btree ("last_name","first_name");