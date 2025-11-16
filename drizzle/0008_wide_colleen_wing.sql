CREATE TABLE "twoFactorConfirmation" (
	"id" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "twoFactorConfirmation_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "twoFactorTokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "twoFactorTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isTwoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "twoFactorConfirmation" text;--> statement-breakpoint
ALTER TABLE "twoFactorConfirmation" ADD CONSTRAINT "twoFactorConfirmation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;