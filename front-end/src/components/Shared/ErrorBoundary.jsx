import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to render the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to the console
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Optionally, log error to an external service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error details
    this.setState({ error, errorInfo });
  }

  renderErrorDetails() {
    const { error, errorInfo } = this.state;

    return (
      <div style={{ padding: "20px", backgroundColor: "#f8d7da", color: "#842029", border: "1px solid #f5c2c7", borderRadius: "5px" }}>
        <h2>Something went wrong.</h2>
        <p><strong>Error:</strong> {error && error.toString()}</p>
        <details style={{ whiteSpace: "pre-wrap" }}>
          <summary>Click to view more details</summary>
          {errorInfo && errorInfo.componentStack}
        </details>
        <p>
          <strong>Suggested Actions:</strong>
        </p>
        <ul>
          <li>Check the console for more details.</li>
          <li>Verify the file and line numbers provided in the stack trace.</li>
          <li>Review recent changes to the codebase.</li>
        </ul>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          {this.renderErrorDetails()}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
