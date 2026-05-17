CREATE TABLE "account" (
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
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "resetPasswordToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "resetPasswordToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "twoFactorConfirmation" (
	"id" text NOT NULL,
	"expires" timestamp NOT NULL,
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
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" text DEFAULT 'USER',
	"department" text,
	"manager_id" text,
	"isTwoFactorEnabled" boolean DEFAULT false,
	"twoFactorConfirmationId" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"changes" jsonb,
	"changed_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escalation_event" (
	"id" text PRIMARY KEY NOT NULL,
	"rule_id" text NOT NULL,
	"user_id" text NOT NULL,
	"cycle_id" text,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"resolved_at" timestamp,
	"resolved_by_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escalation_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"trigger" text NOT NULL,
	"days_after_trigger" integer NOT NULL,
	"notify_employee" boolean DEFAULT true NOT NULL,
	"notify_manager" boolean DEFAULT true NOT NULL,
	"notify_hr" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goal_sheet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"submitted_at" timestamp,
	"approved_by_id" text,
	"approved_at" timestamp,
	"returned_at" timestamp,
	"return_reason" text,
	"unlocked_at" timestamp,
	"unlocked_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_sheet_id" text NOT NULL,
	"thrust_area_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"uom_type" text NOT NULL,
	"target_value" numeric(14, 4),
	"target_deadline" timestamp,
	"weightage" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"shared_goal_id" text,
	"is_shared_recipient" boolean DEFAULT false NOT NULL,
	"is_primary_owner" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "manager_check_in" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"manager_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"period" text NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "performance_cycle" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"phase" text NOT NULL,
	"opens_at" timestamp NOT NULL,
	"closes_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "quarterly_update" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"period" text NOT NULL,
	"actual_value" numeric(14, 4),
	"actual_completion_date" timestamp,
	"achievement_status" text DEFAULT 'NOT_STARTED' NOT NULL,
	"progress_score" numeric(7, 4),
	"notes" text,
	"updated_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "shared_goal" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"thrust_area_id" text NOT NULL,
	"uom_type" text NOT NULL,
	"target_value" numeric(14, 4),
	"target_deadline" timestamp,
	"primary_owner_user_id" text NOT NULL,
	"created_by_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "thrust_area" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "thrust_area_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twoFactorConfirmation" ADD CONSTRAINT "twoFactorConfirmation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_manager_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_rule_id_escalation_rule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."escalation_rule"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_event" ADD CONSTRAINT "escalation_event_resolved_by_id_user_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_approved_by_id_user_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_sheet" ADD CONSTRAINT "goal_sheet_unlocked_by_id_user_id_fk" FOREIGN KEY ("unlocked_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_goal_sheet_id_goal_sheet_id_fk" FOREIGN KEY ("goal_sheet_id") REFERENCES "public"."goal_sheet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_thrust_area_id_thrust_area_id_fk" FOREIGN KEY ("thrust_area_id") REFERENCES "public"."thrust_area"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_shared_goal_id_shared_goal_id_fk" FOREIGN KEY ("shared_goal_id") REFERENCES "public"."shared_goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_check_in" ADD CONSTRAINT "manager_check_in_employee_id_user_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_check_in" ADD CONSTRAINT "manager_check_in_manager_id_user_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_check_in" ADD CONSTRAINT "manager_check_in_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarterly_update" ADD CONSTRAINT "quarterly_update_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarterly_update" ADD CONSTRAINT "quarterly_update_updated_by_id_user_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_thrust_area_id_thrust_area_id_fk" FOREIGN KEY ("thrust_area_id") REFERENCES "public"."thrust_area"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_primary_owner_user_id_user_id_fk" FOREIGN KEY ("primary_owner_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_goal" ADD CONSTRAINT "shared_goal_cycle_id_performance_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."performance_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "goal_sheet_user_cycle_idx" ON "goal_sheet" USING btree ("user_id","cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "manager_check_in_employee_cycle_period_idx" ON "manager_check_in" USING btree ("employee_id","cycle_id","period");--> statement-breakpoint
CREATE UNIQUE INDEX "performance_cycle_year_phase_idx" ON "performance_cycle" USING btree ("year","phase");--> statement-breakpoint
CREATE UNIQUE INDEX "quarterly_update_goal_period_idx" ON "quarterly_update" USING btree ("goal_id","period");