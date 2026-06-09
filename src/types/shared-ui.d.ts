declare module 'shared-ui' {
  import * as React from 'react';

  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
  }
  export const Card: React.FC<CardProps>;
  
  export const CardHeader: React.FC<CardProps>;
  export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement> & { className?: string }>;
  export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement> & { className?: string }>;
  export const CardContent: React.FC<CardProps>;
  export const CardFooter: React.FC<CardProps>;

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    icon?: React.ComponentType<{ className?: string }>;
  }
  export const Button: React.FC<ButtonProps>;

  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  }
  export const Badge: React.FC<BadgeProps>;

  export interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    subtitle?: string;
  }
  export const StatCard: React.FC<StatCardProps>;

  export interface StatusBadgeProps {
    status: string;
    type?: string;
  }
  export const StatusBadge: React.FC<StatusBadgeProps>;

  export interface AlertBannerProps {
    type?: 'warning' | 'critical' | 'info' | 'success';
    message: string;
    actionText?: string;
    onAction?: () => void;
  }
  export const AlertBanner: React.FC<AlertBannerProps>;

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
  }
  export const Input: React.FC<InputProps>;

  export interface SearchFilterBarProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    filters?: Array<{ id: string; label: string }>;
    activeFilter?: string;
    onFilterChange?: (filterId: string) => void;
  }
  export const SearchFilterBar: React.FC<SearchFilterBarProps>;

  export interface IntelligenceTableColumn<T> {
    header: string;
    accessorKey: string;
    className?: string;
    cell?: (row: T) => React.ReactNode;
  }

  export interface IntelligenceTableProps<T> {
    columns: IntelligenceTableColumn<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
  }
  
  export function IntelligenceTable<T>(props: IntelligenceTableProps<T>): React.ReactElement;

  export interface RecommendationItem {
    type: 'info' | 'warning' | 'critical' | 'success';
    message: string;
    action?: string;
  }

  export interface RecommendationCardProps {
    title: string;
    recommendations: RecommendationItem[];
  }
  export const RecommendationCard: React.FC<RecommendationCardProps>;
}
