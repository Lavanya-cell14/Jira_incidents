import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  Badge,
  Button,
  Card,
  IntelligenceTable,
  StatCard,
  StatusBadge,
} from 'shared-ui';

import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  Ticket as TicketIcon,
  X,
} from 'lucide-react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';

interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  resolution?: string;
  resolved_by?: string | null;
  reporter: string;
  assignee: string;
  created: string | null;
  updated?: string | null;
  [key: string]: unknown;
}

interface TicketsResponse {
  tickets: JiraTicket[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  is_last: boolean;
  next_page_token: string | null;
}

interface PriorityItem {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

interface ManualResolutionForm {
  resolution: string;
  complaint: string;
  resolved_by: string;
  comment: string;
}

interface ResolutionSuggestion {
  id: string;
  type: 'RAG Resolution' | 'Runbook Resolution';
  resolution: string;
  source?: unknown;
  similarity?: unknown;
  reason?: unknown;
}

const pageSize = 15;
const statsPageSize = 50;

const priorityColorClass: Record<string, string> = {
  Critical: 'bg-red-500',
  High: 'bg-amber-500',
  Medium: 'bg-blue-500',
  Low: 'bg-emerald-500',
};

const statusStyleMap: Record<string, string> = {
  Open: 'Warning',
  'In Progress': 'In Transit',
  Resolved: 'Available',
  Closed: 'Available',
  completed: 'Available',
  Completed: 'Available',
};

const detailFieldOrder = [
  'id',
  'key',
  'summary',
  'description',
  'status',
  'priority',
  'category',
  'resolution',
  'resolved_by',
  'reporter',
  'assignee',
  'created',
  'updated',
];

const nestedDetailFields = ['ai_analyses', 'approval_histories', 'comments', 'recommendations'];

function priorityVariant(priority: string): BadgeVariant {
  if (priority === 'Critical') return 'error';
  if (priority === 'High') return 'warning';
  if (priority === 'Medium') return 'default';
  if (priority === 'Low') return 'outline';
  return 'secondary';
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Not available';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function formatFieldLabel(field: string) {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatStatusLabel(status: string) {
  if (status.toLowerCase() === 'completed') return 'Completed';
  return status;
}

function isCompletedStatus(status: string) {
  return ['resolved', 'closed', 'completed'].includes(status.toLowerCase());
}

function getResolvedBy(ticket: JiraTicket) {
  return ticket.resolved_by ?? ticket.resolvedBy ?? '';
}

function isAiResolved(ticket: JiraTicket) {
  const resolvedBy = String(getResolvedBy(ticket)).toLowerCase().replace(/[^a-z0-9]/g, '');
  return resolvedBy === 'airesolve';
}

function getExtraDetailRows(ticket: JiraTicket) {
  return Object.entries(ticket).filter(
    ([field]) => !detailFieldOrder.includes(field) && !nestedDetailFields.includes(field),
  );
}

function getArrayField(ticket: JiraTicket, field: string) {
  const value = ticket[field];
  return Array.isArray(value) ? value : [];
}

function getRecordEntries(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value);
}

function createManualForm(ticket: JiraTicket): ManualResolutionForm {
  return {
    resolution: '',
    complaint: ticket.description || ticket.summary || '',
    resolved_by: '',
    comment: '',
  };
}

function getResolutionSuggestions(ticket: JiraTicket): ResolutionSuggestion[] {
  return getArrayField(ticket, 'ai_analyses').flatMap((analysis, index) => {
    if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) return [];

    const record = analysis as Record<string, unknown>;
    const suggestions: ResolutionSuggestion[] = [];

    if (record.rag_resolution) {
      suggestions.push({
        id: `rag-${record.id ?? index}`,
        type: 'RAG Resolution',
        resolution: String(record.rag_resolution),
        source: record.source_used,
        similarity: record.similarity_score,
        reason: record.decision_reason,
      });
    }

    if (record.runbook_resolution) {
      suggestions.push({
        id: `runbook-${record.id ?? index}`,
        type: 'Runbook Resolution',
        resolution: String(record.runbook_resolution),
        source: record.source_used,
        similarity: record.runbook_score ?? record.similarity_score,
        reason: record.decision_reason,
      });
    }

    return suggestions;
  });
}

function DetailItem({ label, value, wide = false }: { label: string; value: unknown; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-950">
        {formatValue(value)}
      </p>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h4 className="text-sm font-bold text-slate-950">{title}</h4>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DetailCollection({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: unknown[];
  emptyText: string;
}) {
  return (
    <DetailSection title={`${title} (${items.length})`}>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getRecordEntries(item).map(([field, value]) => (
                  <DetailItem
                    key={field}
                    label={formatFieldLabel(field)}
                    value={value}
                    wide={String(value).length > 80}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium text-slate-500">{emptyText}</p>
      )}
    </DetailSection>
  );
}

export default function Dashboard() {
  const [ticketsList, setTicketsList] = useState<JiraTicket[]>([]);
  const [allTickets, setAllTickets] = useState<JiraTicket[]>([]);
  const [pagination, setPagination] = useState<Omit<TicketsResponse, 'tickets'>>({
    total: 0,
    page: 1,
    page_size: pageSize,
    total_pages: 1,
    is_last: true,
    next_page_token: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<JiraTicket | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState<ManualResolutionForm>({
    resolution: '',
    complaint: '',
    resolved_by: '',
    comment: '',
  });
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSuccess, setManualSuccess] = useState<string | null>(null);

  const fetchTickets = async (targetPage = page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/jira/tickets?page=${targetPage}&page_size=${pageSize}`);

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const data = (await response.json()) as TicketsResponse;
      setTicketsList(data.tickets ?? []);
      setPagination({
        total: data.total,
        page: data.page,
        page_size: data.page_size,
        total_pages: data.total_pages,
        is_last: data.is_last,
        next_page_token: data.next_page_token,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Jira tickets');
      setTicketsList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTicketsForStats = async () => {
    setStatsLoading(true);

    try {
      const firstResponse = await fetch(`/jira/tickets?page=1&page_size=${statsPageSize}`);

      if (!firstResponse.ok) {
        throw new Error(`Stats request failed with ${firstResponse.status}`);
      }

      const firstPage = (await firstResponse.json()) as TicketsResponse;
      const remainingPages = Array.from(
        { length: Math.max(0, firstPage.total_pages - 1) },
        (_, index) => index + 2,
      );

      const remainingResponses = await Promise.all(
        remainingPages.map(async (pageNumber) => {
          const response = await fetch(`/jira/tickets?page=${pageNumber}&page_size=${statsPageSize}`);

          if (!response.ok) {
            throw new Error(`Stats request failed with ${response.status}`);
          }

          return (await response.json()) as TicketsResponse;
        }),
      );

      setAllTickets([
        ...(firstPage.tickets ?? []),
        ...remainingResponses.flatMap((response) => response.tickets ?? []),
      ]);
    } catch {
      setAllTickets([]);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  useEffect(() => {
    fetchAllTicketsForStats();
  }, []);

  useEffect(() => {
    if (!selectedTicket) {
      setShowManualForm(false);
      return;
    }

    setManualForm(createManualForm(selectedTicket));
    setManualError(null);
    setManualSuccess(null);
    setManualSubmitting(false);
  }, [selectedTicket]);

  const handleManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTicket) return;

    setManualSubmitting(true);
    setManualError(null);
    setManualSuccess(null);

    try {
      const response = await fetch(`/jira/tickets/${selectedTicket.key}/human-resolution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with ${response.status}`);
      }

      setManualSuccess('Manual resolution submitted successfully.');
      await fetchTickets(page);
      await fetchAllTicketsForStats();
      setSelectedTicket((ticket) =>
        ticket
          ? {
              ...ticket,
              status: 'completed',
              resolution: manualForm.resolution,
              resolved_by: manualForm.resolved_by,
            }
          : ticket,
      );
      setShowManualForm(false);
    } catch (err) {
      setManualError(err instanceof Error ? err.message : 'Unable to submit manual resolution');
    } finally {
      setManualSubmitting(false);
    }
  };

  const currentStats = useMemo(() => {
    const sourceTickets = allTickets.length ? allTickets : ticketsList;
    const completed = sourceTickets.filter((ticket) => isCompletedStatus(ticket.status)).length;
    const waitingForSupport = sourceTickets.length - completed;

    return {
      total: pagination.total || sourceTickets.length,
      completed,
      waitingForSupport,
    };
  }, [allTickets, pagination.total, ticketsList]);

  const priorityBreakdown = useMemo<PriorityItem[]>(() => {
    const order = ['Critical', 'High', 'Medium', 'Low'];

    return order.map((priority) => {
      const count = ticketsList.filter((ticket) => ticket.priority === priority).length;
      const percentage = ticketsList.length ? Math.round((count / ticketsList.length) * 100) : 0;

      return {
        name: priority,
        count,
        percentage,
        color: priorityColorClass[priority],
      };
    });
  }, [ticketsList]);

  const columns = [
    {
      header: 'Key',
      accessorKey: 'key',
      className: 'w-[110px] font-mono text-xs font-semibold text-slate-950',
    },
    {
      header: 'Summary',
      accessorKey: 'summary',
      className: 'min-w-[240px] text-sm',
    },
    {
      header: 'Description',
      accessorKey: 'description',
      className: 'min-w-[300px] text-sm text-slate-600',
      cell: (row: JiraTicket) => (
        <span title={row.description} className="line-clamp-2">
          {row.description}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      className: 'w-[130px]',
      cell: (row: JiraTicket) => (
        <StatusBadge status={formatStatusLabel(row.status)} type={statusStyleMap[row.status]} />
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      className: 'w-[120px]',
      cell: (row: JiraTicket) => <Badge variant={priorityVariant(row.priority)}>{row.priority}</Badge>,
    },
    {
      header: 'Reporter',
      accessorKey: 'reporter',
      className: 'w-[160px] text-sm font-semibold text-slate-800',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Cognitive Ticket Resolution Engine
              </h1>
              <p className="max-w-3xl text-sm font-medium text-blue-100">
                Live Jira tickets from page {pagination.page} of {pagination.total_pages}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchTickets(page)}
              disabled={loading}
              className="w-fit border-white/40 bg-white text-slate-950 hover:bg-blue-50"
            >
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Tickets"
              value={currentStats.total}
              icon={TicketIcon}
              trend="neutral"
              trendValue={`${ticketsList.length} shown`}
              subtitle="All tickets in table source"
            />
            <StatCard
              title="Waiting for Support"
              value={currentStats.waitingForSupport}
              icon={AlertCircle}
              trend="neutral"
              trendValue={statsLoading ? 'Loading' : 'All pages'}
              subtitle="Open or in progress"
            />
            <StatCard
              title="Completed"
              value={currentStats.completed}
              icon={CheckCircle2}
              trend="neutral"
              trendValue={statsLoading ? 'Loading' : 'All pages'}
              subtitle="Resolved or closed"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
            <section className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <ShieldAlert className="h-5 w-5 text-slate-500" />
                  Jira Tickets
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>
                    Showing {ticketsList.length} of {pagination.total}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ChevronLeft}
                    disabled={loading || page <= 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                  >
                    Previous
                  </Button>
                  <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
                    {pagination.page} / {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ChevronRight}
                    disabled={loading || pagination.is_last}
                    onClick={() => setPage((value) => value + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  Failed to load tickets: {error}
                </div>
              )}

              {loading ? (
                <div className="flex h-72 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 shadow-sm">
                  Loading Jira tickets...
                </div>
              ) : (
                <div className="max-h-[620px] overflow-auto rounded-lg bg-white">
                  <IntelligenceTable
                    columns={columns}
                    data={ticketsList}
                    onRowClick={(ticket) => setSelectedTicket(ticket)}
                  />
                </div>
              )}
            </section>

            <aside className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <BarChart3 className="h-5 w-5 text-slate-500" />
                  Priority Breakdown
                </h2>
                <Card>
                  <div className="flex flex-col gap-1.5 border-b border-slate-200 px-5 py-4">
                    <h3 className="text-sm font-semibold text-slate-950">Current Page Stats</h3>
                    <p className="text-xs font-medium text-slate-500">Calculated from the {ticketsList.length} visible tickets</p>
                  </div>
                  <div className="space-y-5 p-5">
                    {priorityBreakdown.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="text-slate-950">
                            {item.count} tickets ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setSelectedTicket(null);
            setShowManualForm(false);
          }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex flex-col gap-2 pr-6">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600">
                    {selectedTicket.key}
                  </span>
                  <Badge variant={priorityVariant(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                  <StatusBadge
                    status={formatStatusLabel(selectedTicket.status)}
                    type={statusStyleMap[selectedTicket.status]}
                  />
                </div>
                <h3 className="text-lg font-bold leading-snug text-slate-950">
                  {selectedTicket.summary}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setShowManualForm(false);
                }}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto bg-white p-6">
              {manualSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {manualSuccess}
                </div>
              )}

              <DetailSection title="Ticket Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem label="Id" value={selectedTicket.id} wide />
                  <DetailItem label="Key" value={selectedTicket.key} />
                  <DetailItem label="Status" value={formatStatusLabel(selectedTicket.status)} />
                  <DetailItem label="Priority" value={selectedTicket.priority} />
                  <DetailItem label="Category" value={selectedTicket.category} />
                  <DetailItem label="Resolved By" value={getResolvedBy(selectedTicket)} />
                  <DetailItem label="Reporter" value={selectedTicket.reporter} />
                  <DetailItem label="Assignee" value={selectedTicket.assignee} />
                  <DetailItem label="Created" value={selectedTicket.created} />
                  <DetailItem label="Updated" value={selectedTicket.updated} />
                  <DetailItem label="Summary" value={selectedTicket.summary} wide />
                  <DetailItem label="Description" value={selectedTicket.description} wide />
                </div>
              </DetailSection>

              <DetailSection title="Resolution">
                <DetailItem label="Resolution" value={selectedTicket.resolution} wide />
              </DetailSection>

              <DetailCollection
                title="AI Analyses"
                items={getArrayField(selectedTicket, 'ai_analyses')}
                emptyText="No AI analyses found for this ticket."
              />

              <DetailCollection
                title="Comments"
                items={getArrayField(selectedTicket, 'comments')}
                emptyText="No comments found for this ticket."
              />

              <DetailCollection
                title="Recommendations"
                items={getArrayField(selectedTicket, 'recommendations')}
                emptyText="No recommendations found for this ticket."
              />

              <DetailCollection
                title="Approval History"
                items={getArrayField(selectedTicket, 'approval_histories')}
                emptyText="No approval history found for this ticket."
              />

              {getExtraDetailRows(selectedTicket).length > 0 && (
                <DetailSection title="Additional Fields">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getExtraDetailRows(selectedTicket).map(([field, value]) => (
                      <DetailItem
                        key={field}
                        label={formatFieldLabel(field)}
                        value={value}
                        wide={String(value).length > 80}
                      />
                    ))}
                  </div>
                </DetailSection>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
              {!isAiResolved(selectedTicket) && !showManualForm && (
                <Button
                  variant="primary"
                  size="sm"
                  className="font-bold"
                  onClick={() => setShowManualForm(true)}
                >
                  Manual Entry
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedTicket(null);
                  setShowManualForm(false);
                }}
                className="font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedTicket && showManualForm && !isAiResolved(selectedTicket) && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowManualForm(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex flex-col gap-2 pr-6">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600">
                    {selectedTicket.key}
                  </span>
                  <Badge variant={priorityVariant(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                  <StatusBadge
                    status={formatStatusLabel(selectedTicket.status)}
                    type={statusStyleMap[selectedTicket.status]}
                  />
                </div>
                <h3 className="text-lg font-bold leading-snug text-slate-950">
                  Manual Resolution Entry
                </h3>
                <p className="text-sm font-medium text-slate-500">{selectedTicket.summary}</p>
              </div>
              <button
                onClick={() => setShowManualForm(false)}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close manual entry"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <section className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-950">RAG and Runbook Suggestions</h4>
                  <p className="text-xs font-medium text-slate-500">
                    Click any card to copy its resolution into the form. You can add or edit text before submitting.
                  </p>
                </div>

                {getResolutionSuggestions(selectedTicket).length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getResolutionSuggestions(selectedTicket).map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() =>
                          setManualForm((current) => ({
                            ...current,
                            resolution: suggestion.resolution,
                          }))
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={suggestion.type === 'RAG Resolution' ? 'default' : 'secondary'}>
                            {suggestion.type}
                          </Badge>
                          {suggestion.source !== undefined && (
                            <span className="text-xs font-semibold text-slate-500">
                              Source: {formatValue(suggestion.source)}
                            </span>
                          )}
                          {suggestion.similarity !== undefined && (
                            <span className="text-xs font-semibold text-slate-500">
                              Score: {formatValue(suggestion.similarity)}
                            </span>
                          )}
                        </div>
                        {suggestion.reason !== undefined && (
                          <p className="mt-2 text-xs font-medium text-slate-500">{formatValue(suggestion.reason)}</p>
                        )}
                        <p className="mt-3 whitespace-pre-wrap text-sm font-semibold text-slate-950">
                          {suggestion.resolution}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                    No RAG or runbook resolutions were returned for this ticket.
                  </div>
                )}
              </section>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Resolution</span>
                    <textarea
                      required
                      rows={6}
                      value={manualForm.resolution}
                      onChange={(event) =>
                        setManualForm((current) => ({
                          ...current,
                          resolution: event.target.value,
                        }))
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Click a RAG/runbook card above or type the human resolution..."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Complaint</span>
                    <textarea
                      required
                      rows={3}
                      value={manualForm.complaint}
                      onChange={(event) =>
                        setManualForm((current) => ({
                          ...current,
                          complaint: event.target.value,
                        }))
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Ticket complaint..."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Resolved By</span>
                    <input
                      required
                      value={manualForm.resolved_by}
                      onChange={(event) =>
                        setManualForm((current) => ({
                          ...current,
                          resolved_by: event.target.value,
                        }))
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Ram"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Comment</span>
                    <textarea
                      required
                      rows={3}
                      value={manualForm.comment}
                      onChange={(event) =>
                        setManualForm((current) => ({
                          ...current,
                          comment: event.target.value,
                        }))
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Human reviewed the unresolved complaint and confirmed the fix."
                    />
                  </label>
                </div>

                {manualError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {manualError}
                  </div>
                )}

                {manualSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {manualSuccess}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowManualForm(false)}
                    disabled={manualSubmitting}
                    className="font-bold"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={manualSubmitting} className="font-bold">
                    {manualSubmitting ? 'Submitting...' : 'Submit Human Resolution'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
