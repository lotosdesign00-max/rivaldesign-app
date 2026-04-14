import React from 'react';
import SystemIcon from "./SystemIcon";

/**
 * ERROR BOUNDARY
 * Ловит ошибки и показывает fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-state">
          <div className="error-state__icon"><SystemIcon name="warning" size={36} color="var(--accent-500, #f59e0b)" animated tone="glow" /></div>
          <h2 className="error-state__title">Что-то пошло не так</h2>
          <p className="error-state__message">
            {this.state.error?.message || 'Произошла ошибка'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'var(--accent-500)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
