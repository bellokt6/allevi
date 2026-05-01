"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface Toast {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration (default 5 seconds)
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, toast.duration || 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const getToastIcon = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case "warning":
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case "info":
                return <Info className="w-5 h-5 text-orange-600" />;
        }
    };

    const getToastStyles = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            case "info":
                return "bg-orange-50 border-orange-200 text-orange-800";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${getToastStyles(toast.type)}`}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {getToastIcon(toast.type)}
                            </div>
                            <div className="ml-3 flex-1">
                                <h4 className="text-sm font-semibold">{toast.title}</h4>
                                <p className="text-sm mt-1">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Close notification"
                                aria-label="Close notification"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
