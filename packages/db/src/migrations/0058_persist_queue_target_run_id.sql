ALTER TABLE "issue_comments"
  ADD COLUMN "queue_target_run_id" uuid REFERENCES "heartbeat_runs"("id") ON DELETE SET NULL;
