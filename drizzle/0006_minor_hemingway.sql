ALTER TABLE "verificationToken" ADD COLUMN "id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN "identifier";