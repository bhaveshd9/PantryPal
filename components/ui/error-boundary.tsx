'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if the error is an event object
    if (error && typeof error === 'object' && error.toString() === '[object Event]') {
      console.warn('ErrorBoundary caught an event object error:', error);
    } else {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    this.setState({ error, errorInfo });
    
    // In a real app, you would send this to an error reporting service
    // like Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
                <div className="mt-4 flex gap-2">
                  <Button onClick={this.handleReset} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="default" 
                    size="sm"
                  >
                    Refresh Page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to throw errors
export function useErrorHandler() {
  return (error: Error) => {
    // Check if the error is an event object
    if (error && typeof error === 'object' && error.toString() === '[object Event]') {
      console.warn('useErrorHandler caught an event object error:', error);
    } else {
      console.error('Error caught by useErrorHandler:', error);
    }
    throw error;
  };
} 