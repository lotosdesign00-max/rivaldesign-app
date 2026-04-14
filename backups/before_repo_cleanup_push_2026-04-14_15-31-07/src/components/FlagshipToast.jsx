import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import './FlagshipToast.css';

/**
 * FLAGSHIP TOAST — Premium Level
 * Features:
 * - Auto-dismiss with progress bar
 * - Swipe to dismiss
 * - Stacking with offset
 * - Action buttons
 * - 4 variants
 * - Context API for global usage
 */

// Toast Context
const ToastContext = createContext(null);

export function ToastProvider({ children, position = 'top-right' }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 5000,
      ...toast,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className={`flagship-toast-container flagship-toast-container--${position}`}>
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
              index={index}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// Toast Component
function Toast({
  id,
  type = 'info', // success, error, warning, info
  title,
  message,
  duration = 5000,
  onClose,
  action,
  compact = false,
  index = 0,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const toastRef = useRef(null);
  const timerRef = useRef(null);

  // Auto dismiss
  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Swipe to dismiss
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (Math.abs(offsetX) > 100) {
      handleClose();
    } else {
      setOffsetX(0);
      if (duration > 0) {
        timerRef.current = setTimeout(handleClose, duration);
      }
    }
  };

  const icons = {
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M13.3333 4L6 11.3333L2.66667 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M12 4L4 12M4 4L12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    warning: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 5.33333V8M8 10.6667H8.00667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 10.6667V8M8 5.33333H8.00667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return (
    <div
      ref={toastRef}
      className={`flagship-toast flagship-toast--${type} ${
        compact ? 'flagship-toast--compact' : ''
      } ${isClosing ? 'flagship-toast--closing' : ''}`}
      style={{
        transform: `translateX(${offsetX}px)`,
        opacity: Math.max(0, 1 - Math.abs(offsetX) / 200),
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClose}
    >
      {/* Effects */}
      <div className="flagship-toast__shine" />

      {/* Content */}
      <div className="flagship-toast__content">
        <div className="flagship-toast__icon">{icons[type]}</div>
        <div className="flagship-toast__body">
          {title && <h4 className="flagship-toast__title">{title}</h4>}
          {message && <p className="flagship-toast__message">{message}</p>}
          {action && (
            <div className="flagship-toast__action">
              <button
                className="flagship-toast__action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  handleClose();
                }}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        <button
          className="flagship-toast__close"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="flagship-toast__progress">
          <div
            className="flagship-toast__progress-bar"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

// Helper functions
export const toast = {
  success: (message, options = {}) => {
    if (typeof window !== 'undefined' && window.__toastContext) {
      return window.__toastContext.addToast({ type: 'success', message, ...options });
    }
  },
  error: (message, options = {}) => {
    if (typeof window !== 'undefined' && window.__toastContext) {
      return window.__toastContext.addToast({ type: 'error', message, ...options });
    }
  },
  warning: (message, options = {}) => {
    if (typeof window !== 'undefined' && window.__toastContext) {
      return window.__toastContext.addToast({ type: 'warning', message, ...options });
    }
  },
  info: (message, options = {}) => {
    if (typeof window !== 'undefined' && window.__toastContext) {
      return window.__toastContext.addToast({ type: 'info', message, ...options });
    }
  },
};

// Store context globally for helper functions
if (typeof window !== 'undefined') {
  const OriginalProvider = ToastProvider;
  ToastProvider = ({ children, ...props }) => {
    const context = useContext(ToastContext);
    useEffect(() => {
      if (context) {
        window.__toastContext = context;
      }
    }, [context]);
    return <OriginalProvider {...props}>{children}</OriginalProvider>;
  };
}

export default Toast;
