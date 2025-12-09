import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-8 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">오류가 발생했습니다</h1>
                    <p className="text-gray-400 mb-8">앱을 실행하는 도중 문제가 발생했습니다.</p>
                    <div className="bg-gray-900 p-4 rounded text-left overflow-auto max-w-2xl text-gray-400 mb-6 border border-gray-800">
                        <p>일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-500 transition-colors"
                    >
                        메인으로 돌아가기
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 border border-gray-700 text-gray-400 rounded hover:bg-gray-800 transition-colors"
                    >
                        새로고침
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
