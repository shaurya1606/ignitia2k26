CREATE TABLE "resetPasswordToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "resetPasswordToken_token_unique" UNIQUE("token")
);
