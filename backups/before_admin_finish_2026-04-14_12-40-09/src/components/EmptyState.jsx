/**
 * EMPTY STATE
 * Компонент для пустых состояний
 */

import React from 'react';
import './EmptyState.css';
import FlagshipButton from './FlagshipButton';

export default function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  actionLabel,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && actionLabel && (
        <FlagshipButton onClick={action} variant="secondary" className="empty-state__action">
          {actionLabel}
        </FlagshipButton>
      )}
    </div>
  );
}
