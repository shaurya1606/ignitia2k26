CREATE TABLE "usersTable" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"emailVerified" timestamp,
	"password" text,
	"role" text DEFAULT 'USER',
	CONSTRAINT "usersTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "userTable" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "userTable" CASCADE;--> statement-breakpoint
ALTER TABLE "accountsTable" DROP CONSTRAINT "accountsTable_userId_userTable_id_fk";
--> statement-breakpoint
ALTER TABLE "accountsTable" ADD CONSTRAINT "accountsTable_userId_usersTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usersTable"("id") ON DELETE cascade ON UPDATE no action;