import React, { useState, useRef } from 'react';
import './FlagshipInput.css';

/**
 * FLAGSHIP INPUT — Premium Level
 * Features:
 * - Floating labels
 * - Focus glow effect
 * - Icon support
 * - Validation states
 * - Character counter
 * - 3 variants × 3 sizes
 */

export default function FlagshipInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  variant = 'glass', // glass, elevated, premium
  size = 'md', // sm, md, lg
  error = false,
  success = false,
  disabled = false,
  helperText,
  iconLeft,
  iconRight,
  maxLength,
  showCount = false,
  multiline = false,
  rows = 4,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const hasValue = value && value.length > 0;
  const charCount = value?.length || 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;

  const inputClasses = [
    'flagship-input',
    `flagship-input--${variant}`,
    `flagship-input--${size}`,
    error && 'flagship-input--error',
    success && 'flagship-input--success',
    iconLeft && 'flagship-input--with-icon-left',
    iconRight && 'flagship-input--with-icon-right',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const InputElement = multiline ? 'textarea' : 'input';

  return (
    <div className={inputClasses}>
      <div style={{ position: 'relative' }}>
        {/* Icon Left */}
        {iconLeft && <div className="flagship-input__icon flagship-input__icon--left">{iconLeft}</div>}

        {/* Input Field */}
        <InputElement
          ref={inputRef}
          type={multiline ? undefined : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={multiline ? rows : undefined}
          className={`flagship-input__field ${multiline ? 'flagship-input__field--textarea' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Floating Label */}
        {label && <label className="flagship-input__label">{label}</label>}

        {/* Icon Right */}
        {iconRight && <div className="flagship-input__icon flagship-input__icon--right">{iconRight}</div>}

        {/* Focus Glow */}
        <div className="flagship-input__glow" />

        {/* Character Count */}
        {showCount && maxLength && (
          <div
            className={`flagship-input__count ${
              isOverLimit
                ? 'flagship-input__count--error'
                : isNearLimit
                ? 'flagship-input__count--warning'
                : ''
            }`}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <div className="flagship-input__helper">{helperText}</div>}
    </div>
  );
}
