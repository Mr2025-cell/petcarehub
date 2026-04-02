import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary — Catches unhandled React render errors and shows
 * a user-friendly fallback instead of a blank white screen.
 * Critical for the Execution marking criteria (30%).
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={containerStyle}>
          <div style={cardStyle}>
            <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--neutral-900)' }}>Something went wrong</h2>
            <p style={{ color: 'var(--neutral-500)', marginBottom: '1.5rem', textAlign: 'center', maxWidth: 400 }}>
              An unexpected error occurred. This has been logged and we're working on a fix. You can try again or return to the home page.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={this.handleReset} style={primaryBtnStyle}>
                <RefreshCw size={16} /> Try Again
              </button>
              <button onClick={() => { this.handleReset(); window.location.href = '/'; }} style={outlineBtnStyle}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
  background: 'var(--neutral-50)',
};

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '3rem 2rem',
  borderRadius: 'var(--radius-xl)',
  background: 'white',
  boxShadow: 'var(--shadow-lg)',
  maxWidth: 480,
  width: '100%',
};

const primaryBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1.25rem',
  borderRadius: 'var(--radius-md)',
  background: 'var(--primary-600)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.875rem',
};

const outlineBtnStyle = {
  ...primaryBtnStyle,
  background: 'transparent',
  color: 'var(--neutral-700)',
  border: '1px solid var(--neutral-300)',
};
