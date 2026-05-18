CREATE TYPE "public"."role" AS ENUM('EMPLOYEE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 'USER');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE'::"public"."role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_disabled" boolean DEFAULT false NOT NULL;