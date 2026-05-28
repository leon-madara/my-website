import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 border dp-rule" style={{ background: "var(--dp-paper-2)" }}>
            <p className="dp-display text-xl" style={{ color: "var(--dp-ink)" }}>
              Something went wrong in this section.
            </p>
            <p className="mt-2" style={{ color: "var(--dp-ink-soft)" }}>
              Please refresh the page or continue scrolling.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
