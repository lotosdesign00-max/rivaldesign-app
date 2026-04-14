/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODAL COMPONENT — Premium Overlay Dialog
 * Accessible modal with animations, backdrop, and focus management
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size styles
  const sizeStyles = {
    sm: { maxWidth: 'var(--modal-width-sm)' },
    md: { maxWidth: 'var(--modal-width-md)' },
    lg: { maxWidth: 'var(--modal-width-lg)' },
    xl: { maxWidth: 'var(--modal-width-xl)' },
    full: { maxWidth: '95vw' },
  };

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement;

      // Focus modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Add escape listener
      document.addEventListener('keydown', handleEscape);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';

        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const backdropStyles = {
    position: 'fixed',
    inset: 0,
    zIndex: 'var(--z-modal-backdrop)',
    background: 'var(--overlay-strong)',
    backdropFilter: 'blur(var(--blur-lg))',
    WebkitBackdropFilter: 'blur(var(--blur-lg))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-4)',
    animation: 'backdropFadeIn var(--duration-normal) var(--ease-out) both',
  };

  const modalStyles = {
    position: 'relative',
    width: '100%',
    ...sizeStyles[size],
    background: 'var(--color-bg-elevated-2)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-3xl)',
    boxShadow: 'var(--shadow-3xl), var(--rim-light-strong)',
    animation: 'modalSlideUp var(--duration-slow) var(--ease-spring) both',
    outline: 'none',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles = {
    padding: 'var(--space-6)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const titleStyles = {
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--weight-bold)',
    color: 'var(--text-primary)',
    letterSpacing: 'var(--tracking-tight)',
    fontFamily: 'var(--font-display)',
  };

  const closeButtonStyles = {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--glass-light)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--duration-fast) var(--ease-out)',
  };

  const contentStyles = {
    padding: 'var(--space-6)',
    overflowY: 'auto',
    flex: 1,
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-relaxed)',
  };

  const footerStyles = {
    padding: 'var(--space-6)',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--space-3)',
    flexShrink: 0,
  };

  return createPortal(
    <div
      style={backdropStyles}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        style={modalStyles}
        className={`modal modal-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && (
              <h2 id="modal-title" style={titleStyles}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                style={closeButtonStyles}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass-medium)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--glass-light)';
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={contentStyles}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={footerStyles}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
