import React, { Component, type ReactNode } from "react";
import { RiAlertLine, RiRefreshLine } from "react-icons/ri";
import { Button } from "./ui/button.tsx";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/30 bg-landing-panel p-6 text-landing-text shadow-sm my-4">
          <div className="flex items-start gap-3">
            <RiAlertLine className="size-5 text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-semibold text-red-300">
                Something went wrong displaying this section
              </h3>
              <p className="text-sm text-landing-muted">
                {this.state.error?.message || this.props.fallbackMessage || "An unexpected error occurred."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="mt-2 gap-2"
              >
                <RiRefreshLine className="size-3.5" />
                <span>Try again</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
