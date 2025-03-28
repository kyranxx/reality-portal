'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Utility function to check if an error is Firebase auth related
const isFirebaseAuthError = (error: Error): boolean => {
  return (
    error.message.includes('Firebase') &&
    (error.message.includes('auth') ||
      error.message.includes('authentication') ||
      error.message.includes('permission') ||
      error.message.includes('unauthorized'))
  );
};

// Class component for error boundary
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
    this.setState({
      errorInfo,
    });

    // Track the error with more detailed information
    const isAuthError = isFirebaseAuthError(error);
    console.log(`Error type: ${isAuthError ? 'Firebase Auth' : 'Other'}`);

    // Could add analytics tracking here
    try {
      // Example of how you might log to a service
      // if (window.gtag) {
      //   window.gtag('event', 'error', {
      //     error_message: error.message,
      //     error_type: isAuthError ? 'firebase_auth' : 'other',
      //     error_stack: error.stack,
      //   });
      // }
    } catch (loggingError) {
      console.error('Error logging failed:', loggingError);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState): void {
    // If we have a redirect path and there's an error, we can redirect
    // This needs to be handled by the wrapper component with router
    if (this.state.hasError && !prevState.hasError && this.props.redirectTo) {
      // Signal to the wrapper that we need to redirect
      window.sessionStorage.setItem('auth_error_redirect', this.props.redirectTo);
      window.dispatchEvent(new Event('auth_error_detected'));
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Provide detailed feedback in development
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="auth-error-boundary">
            {this.props.fallback || (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h2 className="text-lg font-semibold text-red-800">Authentication Error</h2>
                <p className="mt-2 text-sm text-red-700">{this.state.error?.message}</p>
                {this.state.error?.stack && (
                  <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                )}
                <button
                  className="mt-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        );
      }

      // Simple fallback for production
      return (
        this.props.fallback || (
          <div className="p-4">
            <p>Something went wrong with authentication. Please try again.</p>
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
              }}
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Wrapper function component that handles redirection if needed
export default function AuthErrorBoundary({
  children,
  fallback,
  redirectTo = '/auth/login',
}: ErrorBoundaryProps): JSX.Element {
  const router = useRouter();

  React.useEffect(() => {
    // Listen for the redirect event from the error boundary
    const handleAuthError = () => {
      const redirectPath = window.sessionStorage.getItem('auth_error_redirect');
      if (redirectPath) {
        window.sessionStorage.removeItem('auth_error_redirect');
        router.push(redirectPath);
      }
    };

    window.addEventListener('auth_error_detected', handleAuthError);
    return () => {
      window.removeEventListener('auth_error_detected', handleAuthError);
    };
  }, [router]);

  return (
    <ErrorBoundaryClass fallback={fallback} redirectTo={redirectTo}>
      {children}
    </ErrorBoundaryClass>
  );
}

// Create a hook that components can use to manually trigger the error boundary
export function useAuthErrorHandler() {
  return {
    reportAuthError: (error: Error): void => {
      console.error('Manual auth error report:', error);
      if (isFirebaseAuthError(error)) {
        window.sessionStorage.setItem('auth_error_redirect', '/auth/login');
        window.dispatchEvent(new Event('auth_error_detected'));
      }
    },
  };
}
