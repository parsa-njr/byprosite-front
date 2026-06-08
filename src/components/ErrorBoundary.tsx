import React, { Component, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("❌ Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

// ✅ Fallback UI showing error message (in dev)
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
    const navigate = useNavigate();
    //   const isDev = import.meta.env.DEV; // true only in vite dev mode

    return (<>
        <div className="flex min-h-[80vh] w-full items-center justify-center p-6">
            <Card className="w-full max-w-lg text-center shadow-lg border-red-200">
                <CardHeader>
                    <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="h-12 w-12 text-red-500" />
                        <CardTitle className="text-2xl font-bold text-red-600">
                            خطایی رخ داد
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        متاسفانه مشکلی در بارگذاری صفحه پیش آمد. لطفاً دوباره تلاش کنید.
                    </p>

                    {/* Error message (optional, for debugging) */}
                    <p className="text-xs text-gray-400 bg-gray-100 p-2 rounded-md text-left ltr">
                        {error.message}
                    </p>

                    <div className="flex justify-center gap-3 pt-4">
                        <Button onClick={() => window.location.reload()} variant="default">
                            تلاش مجدد
                        </Button>
                        <Button
                            onClick={() => (window.location.href = "/")}
                            variant="outline"
                        >
                            بازگشت به صفحه اصلی
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

    </>
    );
};

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
    <ErrorBoundaryBase>{children}</ErrorBoundaryBase>
);
