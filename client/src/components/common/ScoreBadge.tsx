import React from 'react';
import { Award, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, showLabel = true, size = 'md' }) => {
  let badgeClass = 'badge-score-low';
  let label = 'Low Match';
  let Icon = AlertCircle;

  if (score >= 80) {
    badgeClass = 'badge-score-excellent';
    label = 'Excellent Match';
    Icon = Award;
  } else if (score >= 60) {
    badgeClass = 'badge-score-strong';
    label = 'Strong Match';
    Icon = CheckCircle2;
  } else if (score >= 40) {
    badgeClass = 'badge-score-moderate';
    label = 'Moderate Match';
    Icon = AlertTriangle;
  }

  const sizeStyles = {
    sm: { fontSize: '0.75rem', padding: '0.2rem 0.5rem', iconSize: 12 },
    md: { fontSize: '0.825rem', padding: '0.3rem 0.75rem', iconSize: 14 },
    lg: { fontSize: '1rem', padding: '0.5rem 1rem', iconSize: 18 }
  };

  const style = sizeStyles[size];

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ fontSize: style.fontSize, padding: style.padding }}
      title={`${score}% - ${label}`}
    >
      <Icon size={style.iconSize} />
      <span>{score}%</span>
      {showLabel && <span style={{ opacity: 0.9, fontWeight: 500 }}>{label}</span>}
    </span>
  );
};

export default ScoreBadge;
