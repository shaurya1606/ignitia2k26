ALTER TABLE "user" ADD COLUMN "twoFactorConfirmationId" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "twoFactorConfirmation";