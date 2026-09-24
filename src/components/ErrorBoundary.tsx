import { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

// ======================================================
// TYPES
// ======================================================

interface Props {
    children: ReactNode;
    /** Optional label shown in the error card (e.g. page name) */
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    info: ErrorInfo | null;
    showDetails: boolean;
}

// ======================================================
// ERROR BOUNDARY
// ======================================================

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
        error: null,
        info: null,
        showDetails: false,
    };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({ info });
        // Log to console so developers can still see it
        console.error("[ErrorBoundary]", error, info);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            info: null,
            showDetails: false,
        });
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        const { name = "Halaman" } = this.props;
        const { error, info, showDetails } = this.state;

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F5F9FF] p-6">
                <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-red-100 bg-white shadow-xl">
                    {/* Color stripe */}
                    <div className="h-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400" />

                    <div className="p-8">
                        {/* Icon + Title */}
                        <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-[#082B5F]">
                                    Terjadi Kesalahan
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {name} mengalami error yang tidak terduga.
                                </p>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                <p className="font-mono text-xs font-semibold text-red-700 break-all">
                                    {error.message || String(error)}
                                </p>
                            </div>
                        )}

                        {/* Stack trace toggle */}
                        {info?.componentStack && (
                            <div className="mb-5">
                                <button
                                    onClick={() =>
                                        this.setState((s) => ({
                                            showDetails: !s.showDetails,
                                        }))
                                    }
                                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
                                >
                                    {showDetails ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                    {showDetails
                                        ? "Sembunyikan detail"
                                        : "Lihat detail teknis"}
                                </button>

                                {showDetails && (
                                    <pre className="mt-2 max-h-48 overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-500">
                                        {info.componentStack.trim()}
                                    </pre>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Coba Lagi
                            </button>

                            <button
                                onClick={() => (window.location.href = "/dashboard")}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
                            >
                                Kembali ke Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
