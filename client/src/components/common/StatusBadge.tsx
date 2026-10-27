import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case 'applied':
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
      case 'screening':
        return { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' };
      case 'shortlisted':
        return { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' };
      case 'interview':
        return { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      case 'hired':
        return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
      case 'rejected':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
      default:
        return { bg: '#f8fafc', color: '#334155', border: '#e2e8f0' };
    }
  };

  const colors = getColors(status);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: colors.color
        }}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
