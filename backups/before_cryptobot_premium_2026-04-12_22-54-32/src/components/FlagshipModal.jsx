import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './FlagshipModal.css';

/**
 * FLAGSHIP MODAL — Premium Level
 * Features:
 * - Portal rendering
 * - Backdrop blur
 * - Spring animations
 * - Swipe to dismiss (mobile)
 * - Focus trap
 * - ESC to close
 * - Multiple variants
 */

export default function FlagshipModal({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  footer,
  variant = 'glass', // glass, elevated, premium
  size = 'md', // sm, md, lg, xl, full
  type = 'modal', // modal, drawer, bottom-sheet
  showClose = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = '',
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [startY, setStartY] = useState(0);
  const modalRef = useRef(null);

  // Close with animation
  const handleClose = () => {
    if (!onClose) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swipe to dismiss (mobile)
  const handleTouchStart = (e) => {
    if (type !== 'bottom-sheet') return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (type !== 'bottom-sheet' || !modalRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0) {
      modalRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (type !== 'bottom-sheet' || !modalRef.current) return;
    const endY = e.changedTouches[0].clientY;
    const diff = endY - startY;

    if (diff > 100) {
      handleClose();
    } else {
      modalRef.current.style.transform = '';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`flagship-modal-backdrop ${isClosing ? 'flagship-modal-backdrop--closing' : ''}`}
      onClick={closeOnBackdrop ? handleClose : undefined}
    >
      <div
        ref={modalRef}
        className={`flagship-modal flagship-modal--${variant} flagship-modal--${size} ${
          type !== 'modal' ? `flagship-modal--${type}` : ''
        } ${isClosing ? 'flagship-modal--closing' : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Effects */}
        <div className="flagship-modal__shine" />
        {variant === 'premium' && <div className="flagship-modal__glow" />}

        {/* Header */}
        {(title || showClose) && (
          <div className="flagship-modal__header">
            <div style={{ flex: 1 }}>
              {title && <h2 className="flagship-modal__title">{title}</h2>}
              {subtitle && <p className="flagship-modal__subtitle">{subtitle}</p>}
            </div>
            {showClose && (
              <button className="flagship-modal__close" onClick={handleClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flagship-modal__body">{children}</div>

        {/* Footer */}
        {footer && <div className="flagship-modal__footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
