import { useEffect } from "react";
import { Link } from "@/lib/router";
import { useQuery } from "@tanstack/react-query";
import { issuesApi } from "../api/issues";
import { useCompany } from "../context/CompanyContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { EmptyState } from "../components/EmptyState";
import { PageSkeleton } from "../components/PageSkeleton";
import { StatusIcon } from "../components/StatusIcon";
import { Send } from "lucide-react";

const QUERY_KEY_PREFIX = "cross-posted-issues";

export function CrossPostedIssues() {
  const { selectedCompanyId } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Inbox", href: "/inbox" },
      { label: "Cross-posted" },
    ]);
  }, [setBreadcrumbs]);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY_PREFIX, selectedCompanyId],
    queryFn: () => issuesApi.listCrossPosted(selectedCompanyId!),
    enabled: !!selectedCompanyId,
    refetchInterval: 15000,
  });

  if (!selectedCompanyId) return null;
  if (isLoading) return <PageSkeleton />;
  if (error) {
    return (
      <EmptyState
        icon={Send}
        message={`Could not load cross-posted issues: ${error instanceof Error ? error.message : "Unknown error"}`}
      />
    );
  }

  const issues = data ?? [];
  if (issues.length === 0) {
    return (
      <EmptyState
        icon={Send}
        message="No cross-posted issues yet. Issues this company has posted into other companies will appear here."
      />
    );
  }

  return (
    <div className="px-4 py-4" data-testid="cross-posted-issues-page">
      <h1 className="mb-1 text-base font-medium">Cross-posted issues</h1>
      <p className="mb-4 text-xs text-muted-foreground">
        Issues this company has posted into other companies. Updates come through in real time.
      </p>
      <ul className="divide-y divide-border rounded border border-border">
        {issues.map((issue) => (
          <li key={issue.id} className="flex items-center gap-3 px-3 py-2 text-sm">
            <StatusIcon status={issue.status} className="shrink-0" />
            <Link
              to={`/issues/${issue.identifier ?? issue.id}`}
              className="min-w-0 flex-1 truncate text-inherit no-underline hover:underline"
              data-testid={`cross-posted-issue-${issue.id}`}
            >
              <span className="font-mono text-xs text-muted-foreground">{issue.identifier ?? issue.id.slice(0, 8)}</span>
              <span className="ml-2">{issue.title}</span>
            </Link>
            <span className="shrink-0 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              to {issue.targetCompany?.name ?? issue.companyId.slice(0, 8)}
            </span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{issue.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
