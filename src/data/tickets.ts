export interface Ticket {
  id: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo: string;
  created: string;
  due?: string;
  resolvedByAI?: boolean;
  aiResolutionSummary?: string;
}

export interface Recommendation {
  type: 'info' | 'warning' | 'critical' | 'success';
  message: string;
  action?: string;
}

export interface PriorityItem {
  name: 'Critical' | 'High' | 'Medium' | 'Low';
  count: number;
  color: string;
  percentage: number;
}

export const stats = {
  total: 42,
  open: 12,
  inProgress: 18,
  resolved: 12,
};

export const recentTickets: Ticket[] = [
  {
    id: 'TIC-1082',
    subject: 'Memory leak in web service process node-1',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'Unassigned',
    created: '2026-06-08 11:45',
    resolvedByAI: false,
  },
  {
    id: 'TIC-1081',
    subject: 'OAuth callback failing with HTTP 502 Bad Gateway',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Jane Cooper',
    created: '2026-06-08 10:20',
    resolvedByAI: false,
  },
  {
    id: 'TIC-1080',
    subject: 'API rate limit warnings for database sync service',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Cody Fisher',
    created: '2026-06-08 09:15',
    resolvedByAI: false,
  },
  {
    id: 'TIC-1079',
    subject: 'Database replication lag exceeds SLA threshold (180s)',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'Unassigned',
    created: '2026-06-08 08:30',
    resolvedByAI: false,
  },
  {
    id: 'TIC-1078',
    subject: 'UI styling distortion on PDF export buttons',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Esther Howard',
    created: '2026-06-07 16:40',
    resolvedByAI: true,
    aiResolutionSummary: 'AI analysis identified duplicate margin rules in external print stylesheet. Rules consolidated and padding-top reset to baseline height.',
  },
  {
    id: 'TIC-1077',
    subject: 'Stale client session caching in user views',
    priority: 'High',
    status: 'Resolved',
    assignedTo: 'Jane Cooper',
    created: '2026-06-07 14:10',
    resolvedByAI: true,
    aiResolutionSummary: 'AI detected mismatched expiration timestamps in authentication cookies. Corrected cookie expiration parameter and flushed memory cache.',
  }
];

export const priorityBreakdown: PriorityItem[] = [
  { name: 'Critical', count: 5, color: 'bg-red-500', percentage: 12 },
  { name: 'High', count: 15, color: 'bg-amber-500', percentage: 36 },
  { name: 'Medium', count: 12, color: 'bg-blue-500', percentage: 28 },
  { name: 'Low', count: 10, color: 'bg-emerald-500', percentage: 24 },
];

export const aiRecommendations: Recommendation[] = [
  {
    type: 'critical',
    message: 'Memory leak in node-1 process has triggered a Critical incident. Suggested action: Restart process node-1 and double JVM heap size allocation.',
    action: 'Restart & Resize',
  },
  {
    type: 'warning',
    message: 'High replication lag detected on db-replica-2. Suggested action: Temporarily throttle low-priority background batch processing queries.',
    action: 'Throttle Batch',
  },
  {
    type: 'info',
    message: 'Multiple OAuth authentication errors from the same IP block. Suggested action: Inspect client firewall routing tables and review integration logs.',
    action: 'View IP Logs',
  },
];

export const assignedTickets: Ticket[] = [
  {
    id: 'TIC-1081',
    subject: 'OAuth callback failing with HTTP 502 Bad Gateway',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Jane Cooper',
    created: '2026-06-08 10:20',
    due: 'In 2 hours',
    resolvedByAI: false,
  },
  {
    id: 'TIC-1074',
    subject: 'SSL certificate expiration warning for staging domain',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Jane Cooper',
    created: '2026-06-06 09:30',
    due: 'Tomorrow',
    resolvedByAI: false,
  },
  {
    id: 'TIC-1065',
    subject: 'User profile image upload fails on mobile browsers',
    priority: 'Low',
    status: 'In Progress',
    assignedTo: 'Jane Cooper',
    created: '2026-06-05 15:45',
    due: 'In 3 days',
    resolvedByAI: false,
  },
];
