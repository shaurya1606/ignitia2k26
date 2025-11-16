CREATE TABLE "accountsTable" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "usersTable" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"emailVerified" timestamp,
	"password" text,
	CONSTRAINT "usersTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accountsTable" ADD CONSTRAINT "accountsTable_userId_usersTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usersTable"("id") ON DELETE cascade ON UPDATE no action;