/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INPUT COMPONENT — Premium Form Element
 * Accessible input with validation, icons, and states
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = ref || useRef(null);

  // Size styles
  const sizeStyles = {
    sm: {
      height: 'var(--input-height-sm)',
      fontSize: 'var(--text-sm)',
      padding: '0 var(--space-3)',
    },
    md: {
      height: 'var(--input-height-md)',
      fontSize: 'var(--text-base)',
      padding: '0 var(--space-4)',
    },
    lg: {
      height: 'var(--input-height-lg)',
      fontSize: 'var(--text-lg)',
      padding: '0 var(--space-5)',
    },
  };

  const currentSize = sizeStyles[size];

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputStyles = {
    width: fullWidth ? '100%' : 'auto',
    height: currentSize.height,
    padding: currentSize.padding,
    paddingLeft: icon && iconPosition === 'left' ? 'var(--space-10)' : currentSize.padding,
    paddingRight: (icon && iconPosition === 'right') || type === 'password' ? 'var(--space-10)' : currentSize.padding,
    fontSize: currentSize.fontSize,
    fontFamily: 'var(--font-text)',
    color: 'var(--text-primary)',
    background: disabled ? 'var(--glass-subtle)' : 'var(--glass-light)',
    border: `1px solid ${error ? 'var(--color-error)' : isFocused ? 'var(--border-focus)' : 'var(--border-medium)'}`,
    borderRadius: 'var(--radius-lg)',
    outline: 'none',
    transition: 'all var(--duration-normal) var(--ease-out)',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 'var(--disabled-opacity)' : 1,
    backdropFilter: 'blur(var(--blur-md))',
    WebkitBackdropFilter: 'blur(var(--blur-md))',
    boxShadow: isFocused
      ? `var(--shadow-md), 0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'}`
      : 'var(--shadow-sm)',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: 'var(--space-2)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-medium)',
    color: error ? 'var(--color-error)' : 'var(--text-secondary)',
    letterSpacing: 'var(--tracking-wide)',
  };

  const helperTextStyles = {
    marginTop: 'var(--space-1-5)',
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--color-error)' : 'var(--text-tertiary)',
  };

  const iconStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [iconPosition === 'left' ? 'left' : 'right']: 'var(--space-3)',
    display: 'flex',
    alignItems: 'center',
    color: error ? 'var(--color-error)' : isFocused ? 'var(--accent-400)' : 'var(--text-tertiary)',
    transition: 'color var(--duration-normal) var(--ease-out)',
    pointerEvents: 'none',
  };

  return (
    <div className={`input-wrapper ${className}`} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {/* Label */}
      {label && (
        <label style={labelStyles} htmlFor={props.id}>
          {label}
          {required && <span style={{ color: 'var(--color-error)', marginLeft: 'var(--space-1)' }}>*</span>}
        </label>
      )}

      {/* Input container */}
      <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        {/* Icon */}
        {icon && (
          <div style={iconStyles}>
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyles}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? `${props.id}-helper` : undefined}
          {...props}
        />

        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--space-1)',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color var(--duration-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Helper text / Error */}
      {(helperText || error) && (
        <div id={`${props.id}-helper`} style={helperTextStyles} role={error ? 'alert' : undefined}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Input;
