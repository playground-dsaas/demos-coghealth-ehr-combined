import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  className = '' 
}: BadgeProps) {
  const variants = {
    default: { background: 'var(--ehr-badge-default-bg)', border: '1px solid var(--ehr-badge-default-border)', color: 'var(--ehr-badge-default-text)' },
    success: { background: 'var(--ehr-badge-success-bg)', border: '1px solid var(--ehr-badge-success-border)', color: 'var(--ehr-badge-success-text)' },
    warning: { background: 'var(--ehr-badge-warning-bg)', border: '1px solid var(--ehr-badge-warning-border)', color: 'var(--ehr-badge-warning-text)' },
    danger: { background: 'var(--ehr-badge-danger-bg)', border: '1px solid var(--ehr-badge-danger-border)', color: 'var(--ehr-badge-danger-text)' },
    info: { background: 'var(--ehr-badge-info-bg)', border: '1px solid var(--ehr-badge-info-border)', color: 'var(--ehr-badge-info-text)' },
  };

  return (
    <span 
      className={`inline-flex items-center text-[10px] px-1.5 py-0.5 font-medium ${className}`}
      style={variants[variant]}
    >
      {children}
    </span>
  );
}
