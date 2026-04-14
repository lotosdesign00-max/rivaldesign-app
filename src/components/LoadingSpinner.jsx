/**
 * LOADING SPINNER
 * Универсальный спиннер для загрузки
 */

import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size} ${className}`}>
      <div className="loading-spinner__circle" />
    </div>
  );
}
