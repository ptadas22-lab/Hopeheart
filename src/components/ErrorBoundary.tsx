import React from 'react';

export default class ErrorBoundary extends (React.Component as any) {
  public state = {
    hasError: false
  };

  public static getDerivedStateFromError(_: any) {
    return { hasError: true };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#FAF6EE] text-[#2B1D12]">
          <div className="max-w-md w-full bg-white border border-[#EDE9DE] rounded-[28px] p-8 shadow-xs space-y-5">
            <div className="text-[48px]">🩹</div>
            <h1 className="font-display font-black text-[22px]">Something went wrong.</h1>
            <p className="text-[13.5px] text-gray-550 font-semibold leading-relaxed">
              An unexpected error occurred. Please try reloading the page to resume your self-care journey.
            </p>
            <button
              onClick={this.handleReset}
              type="button"
              className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active-scale shadow-3xs"
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
