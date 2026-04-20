ALTER TABLE "cost_events" DROP CONSTRAINT "cost_events_issue_id_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "finance_events" DROP CONSTRAINT "finance_events_issue_id_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "cost_events" ADD CONSTRAINT "cost_events_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_events" ADD CONSTRAINT "finance_events_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;