import React, { useState } from 'react';
import { 
  StatCard, 
  IntelligenceTable, 
  RecommendationCard, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  StatusBadge,
  Button,
  Input
} from 'shared-ui';
import { stats, recentTickets, priorityBreakdown, aiRecommendations, assignedTickets } from '../data/tickets';
import type { Ticket } from '../data/tickets';
import { 
  Ticket as TicketIcon, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  UserCheck, 
  ShieldAlert,
  X,
  AlertTriangle
} from 'lucide-react';

const priorityColors = {
  Low: 'outline' as const,
  Medium: 'default' as const,
  High: 'warning' as const,
  Critical: 'error' as const,
};

const statusMap: Record<string, string> = {
  'Open': 'Warning',
  'In Progress': 'In Transit',
  'Resolved': 'Available',
};

export default function Dashboard() {
  const [ticketsList, setTicketsList] = useState<Ticket[]>(recentTickets);
  const [currentStats, setCurrentStats] = useState(stats);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [resolvedBy, setResolvedBy] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowManualForm(false);
    setResolutionDesc('');
    setResolvedBy('');
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    // Simulate database write / state update
    // Update the ticket status to 'Resolved' and set resolvedByAI to false
    const updatedTickets = ticketsList.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'Resolved' as const,
          resolvedByAI: false,
          assignedTo: resolvedBy || t.assignedTo,
        };
      }
      return t;
    });

    setTicketsList(updatedTickets);

    // Update the selectedTicket object in modal view
    setSelectedTicket({
      ...selectedTicket,
      status: 'Resolved' as const,
      resolvedByAI: false,
      assignedTo: resolvedBy || selectedTicket.assignedTo,
    });

    // Update stats dynamically
    const prevStatus = selectedTicket.status;
    setCurrentStats((prev) => {
      let openDiff = 0;
      let progressDiff = 0;
      if (prevStatus === 'Open') openDiff = -1;
      if (prevStatus === 'In Progress') progressDiff = -1;
      
      return {
        ...prev,
        open: Math.max(0, prev.open + openDiff),
        inProgress: Math.max(0, prev.inProgress + progressDiff),
        resolved: prev.resolved + 1,
      };
    });

    setIsSubmitted(true);
  };

  const columns = [
    {
      header: 'Ticket ID',
      accessorKey: 'id',
      className: 'w-[100px] font-mono text-xs font-semibold text-gray-900',
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      className: 'min-w-[220px] text-sm',
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      className: 'w-[120px]',
      cell: (row: Ticket) => {
        const variant = priorityColors[row.priority] || 'default';
        return <Badge variant={variant}>{row.priority}</Badge>;
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      className: 'w-[120px]',
      cell: (row: Ticket) => {
        return <StatusBadge status={statusMap[row.status] || row.status} />;
      }
    },
    {
      header: 'Assigned To',
      accessorKey: 'assignedTo',
      className: 'w-[150px] font-medium text-gray-800 text-sm',
    },
    {
      header: 'Created',
      accessorKey: 'created',
      className: 'w-[140px] text-gray-500 text-xs',
    }
  ];

  const assignedColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
      className: 'w-[90px] font-mono text-xs font-semibold text-gray-900',
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      className: 'min-w-[200px] text-sm',
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      className: 'w-[100px]',
      cell: (row: Ticket) => {
        const variant = priorityColors[row.priority] || 'default';
        return <Badge variant={variant}>{row.priority}</Badge>;
      }
    },
    {
      header: 'Due Time',
      accessorKey: 'due',
      className: 'w-[120px] text-xs font-semibold text-indigo-600 dark:text-indigo-400',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] dark:bg-[#0b0f19] transition-colors duration-300">
      {/* Premium Header Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
          
          {/* Header Title Block */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              AI Powered Intelligence Ticket Resolution System
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl">
              AI-driven ticket monitoring and resolution workspace
            </p>
          </div>

          {/* Stats Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Tickets" 
              value={currentStats.total} 
              icon={TicketIcon} 
              subtitle="All active workspace cases"
            />
            <StatCard 
              title="Open Tickets" 
              value={currentStats.open} 
              icon={AlertCircle} 
              trend="down"
              trendValue="-14%"
              subtitle="Requires triage"
            />
            <StatCard 
              title="In Progress" 
              value={currentStats.inProgress} 
              icon={Loader2} 
              trend="up"
              trendValue="+2"
              subtitle="Under investigation"
            />
            <StatCard 
              title="Resolved Tickets" 
              value={currentStats.resolved} 
              icon={CheckCircle2} 
              trend="neutral"
              trendValue="100%"
              subtitle="Met SLA requirements"
            />
          </div>

          {/* Main Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Cases (Recent & Assigned) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Recent Tickets Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-gray-500" />
                    Recent Tickets
                  </h2>
                  <span className="text-xs font-semibold text-gray-400">Real-time update (click row to details)</span>
                </div>
                <IntelligenceTable 
                  columns={columns} 
                  data={ticketsList} 
                  onRowClick={handleTicketClick}
                />
              </div>

              {/* Assigned Tickets Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-gray-500" />
                    Assigned Tickets
                  </h2>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Assigned to: Jane Cooper</span>
                </div>
                <IntelligenceTable 
                  columns={assignedColumns} 
                  data={assignedTickets} 
                />
              </div>
              
            </div>

            {/* Right Column - Controls & Insights (Breakdown & Suggestions) */}
            <div className="flex flex-col gap-8">
              
              {/* AI Suggested Actions */}
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500 fill-indigo-100 dark:fill-none" />
                  AI Suggested Actions
                </h2>
                <RecommendationCard 
                  title="Intelligence Copilot Suggestions" 
                  recommendations={aiRecommendations} 
                />
              </div>

              {/* Priority Breakdown */}
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                  Priority Breakdown
                </h2>
                <Card className="shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-500">
                      Distribution Stats
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      Ecosystem breakdown of active cases
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {priorityBreakdown.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-700 dark:text-gray-300">{item.name} Priority</span>
                          <span className="text-gray-900 dark:text-white">{item.count} tickets ({item.percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Modal Popup Overlay */}
      {selectedTicket && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeModal}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between bg-white dark:bg-gray-900">
              <div className="flex flex-col gap-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {selectedTicket.id}
                  </span>
                  <Badge variant={priorityColors[selectedTicket.priority] || 'default'}>
                    {selectedTicket.priority} Priority
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-2 leading-snug">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button 
                onClick={closeModal} 
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-805 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-white dark:bg-gray-900">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm bg-gray-50/50 dark:bg-gray-950/40 rounded-xl p-4 border border-gray-100/50 dark:border-gray-800/30">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={statusMap[selectedTicket.status] || selectedTicket.status} />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Assigned To</span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{selectedTicket.assignedTo}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Created Date</span>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mt-1">{selectedTicket.created}</p>
                </div>
              </div>

              {/* AI Resolution Status Panel */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                  AI Resolution Status
                </span>

                {selectedTicket.resolvedByAI ? (
                  /* Case 1: Solved by AI */
                  <div className="bg-emerald-50/75 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl p-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <div className="p-1 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </div>
                      <span>Resolved by AI</span>
                    </div>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                      {selectedTicket.aiResolutionSummary}
                    </p>
                  </div>
                ) : (
                  /* Case 2: Not solved by AI */
                  <div className="space-y-4">
                    {!showManualForm && !isSubmitted ? (
                      <div className="bg-amber-50/75 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-bold text-sm">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                          <span>AI could not fully resolve this ticket</span>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => setShowManualForm(true)}
                          className="shrink-0 font-bold shadow-sm"
                        >
                          Manual Entry
                        </Button>
                      </div>
                    ) : isSubmitted ? (
                      /* Success Message */
                      <div className="bg-emerald-50/75 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl p-4 flex items-center gap-3">
                        <div className="p-1 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                          Manual resolution submitted successfully
                        </span>
                      </div>
                    ) : (
                      /* Form inside the same popup */
                      <form onSubmit={handleManualSubmit} className="space-y-4 border border-gray-100 dark:border-gray-800 rounded-xl p-4 bg-gray-50/30 dark:bg-gray-950/10">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                          Submit Manual Resolution
                        </h4>
                        
                        <div className="flex flex-col gap-1.5 w-full">
                          <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                            Resolution Description
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={resolutionDesc}
                            onChange={(e) => setResolutionDesc(e.target.value)}
                            placeholder="Describe the steps taken to manually resolve this ticket..."
                            className="w-full rounded-md border-[#56A8F0] border-[1px] p-3 text-sm text-[#4A4D4E] focus:ring-1 focus:ring-[#56A8F0] focus:border-[#56A8F0] outline-none transition-shadow placeholder:text-gray-400 dark:bg-gray-950 dark:text-white dark:border-gray-800 min-h-[80px]"
                          />
                        </div>

                        <Input
                          label="Resolved By"
                          required
                          value={resolvedBy}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResolvedBy(e.target.value)}
                          placeholder="Your name or agent handle"
                          className="dark:bg-gray-950 dark:text-white dark:border-gray-800"
                        />

                        <div className="flex justify-end gap-3 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            type="button" 
                            onClick={() => setShowManualForm(false)}
                            className="font-semibold"
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            type="submit"
                            className="font-bold"
                          >
                            Submit Resolution
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-950/60 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <Button variant="secondary" size="sm" onClick={closeModal} className="font-bold">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
