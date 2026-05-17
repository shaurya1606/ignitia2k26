ALTER TABLE "audit_log" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "escalation_event" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "escalation_rule" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "goal_sheet" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "goal" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "manager_check_in" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "performance_cycle" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "quarterly_update" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "shared_goal" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "thrust_area" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "audit_log" CASCADE;--> statement-breakpoint
DROP TABLE "escalation_event" CASCADE;--> statement-breakpoint
DROP TABLE "escalation_rule" CASCADE;--> statement-breakpoint
DROP TABLE "goal_sheet" CASCADE;--> statement-breakpoint
DROP TABLE "goal" CASCADE;--> statement-breakpoint
DROP TABLE "manager_check_in" CASCADE;--> statement-breakpoint
DROP TABLE "performance_cycle" CASCADE;--> statement-breakpoint
DROP TABLE "quarterly_update" CASCADE;--> statement-breakpoint
DROP TABLE "shared_goal" CASCADE;--> statement-breakpoint
DROP TABLE "thrust_area" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';