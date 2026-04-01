import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] caught error:", error);
      console.error("[ErrorBoundary] component stack:", info.componentStack);
    }
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            padding: "2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: "1.25rem",
                fontWeight: 500,
                marginBottom: "0.75rem",
              }}
            >
              Something went wrong
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.875rem",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred. Reloading should fix it.
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: "#fff",
                color: "#111",
                border: "none",
                borderRadius: "6px",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
