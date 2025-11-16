CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD PRIMARY KEY ("userId");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "last_name";