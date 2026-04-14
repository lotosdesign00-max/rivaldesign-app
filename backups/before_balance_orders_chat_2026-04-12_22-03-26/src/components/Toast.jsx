/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TOAST COMPONENT — Notification System
 * Stacked toast notifications with auto-dismiss
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--color-success-bg)',
          border: 'var(--color-success)',
          text: 'var(--color-success-light)',
        };
      case 'error':
        return {
          bg: 'var(--color-error-bg)',
          border: 'var(--color-error)',
          text: 'var(--color-error-light)',
        };
      case 'warning':
        return {
          bg: 'var(--color-warning-bg)',
          border: 'var(--color-warning)',
          text: 'var(--color-warning-light)',
        };
      default:
        return {
          bg: 'var(--color-info-bg)',
          border: 'var(--color-info)',
          text: 'var(--color-info-light)',
        };
    }
  };

  const containerStyles = {
    position: 'fixed',
    top: 'calc(var(--space-4) + var(--safe-area-top))',
    right: 'var(--space-4)',
    left: 'var(--space-4)',
    zIndex: 'var(--z-notification)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    pointerEvents: 'none',
  };

  return createPortal(
    <div style={containerStyles}>
      {toasts.map((toast, index) => {
        const colors = getColors(toast.type);
        return (
          <div
            key={toast.id}
            style={{
              background: colors.bg,
              backdropFilter: 'blur(var(--blur-lg))',
              WebkitBackdropFilter: 'blur(var(--blur-lg))',
              border: `1px solid ${colors.border}`,
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              boxShadow: 'var(--shadow-xl), var(--rim-light)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              pointerEvents: 'auto',
              animation: 'toastSlideIn var(--duration-slow) var(--ease-spring) both',
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Icon */}
            <div style={{ color: colors.text, flexShrink: 0 }}>
              {getIcon(toast.type)}
            </div>

            {/* Message */}
            <div style={{
              flex: 1,
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-primary)',
            }}>
              {toast.message}
            </div>

            {/* Close button */}
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--glass-light)',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all var(--duration-fast) var(--ease-out)',
              }}
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
};

Toast.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
      duration: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Toast;
