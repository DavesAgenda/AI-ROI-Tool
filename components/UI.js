
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function GlassCard({ children, className, ...props }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6",
                "shadow-xl shadow-slate-200/50",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/50 to-transparent opacity-50 pointer-events-none" />
            {children}
        </div>
    );
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
    const variants = {
        primary: "bg-[#F48847] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:bg-[#e07b3e] active:scale-[0.98]",
        secondary: "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 active:scale-[0.98]",
        ghost: "bg-transparent text-slate-500 hover:text-brand-orange hover:bg-orange-50"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base font-semibold",
        lg: "px-8 py-3.5 text-lg font-bold"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-all duration-200",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all",
                "focus:border-[#F48847] focus:ring-4 focus:ring-[#F48847]/10",
                className
            )}
            {...props}
        />
    )
}

export function Label({ children, className, ...props }) {
    return (
        <label className={cn("block text-sm font-semibold text-slate-700 mb-2", className)} {...props}>
            {children}
        </label>
    )
}

export function Badge({ children, variant = 'default', className }) {
    const variants = {
        default: "bg-slate-100 text-slate-600 border-slate-200",
        success: "bg-emerald-50 text-emerald-600 border-emerald-200",
        warning: "bg-orange-50 text-orange-600 border-orange-200",
        danger: "bg-rose-50 text-rose-600 border-rose-200",
    }
    return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)}>
            {children}
        </span>
    )
}

export function Modal({ isOpen, onClose, children, className }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className={cn(
                "relative z-10 w-full max-w-2xl transform overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl transition-all",
                className
            )}>
                {children}
            </div>
        </div>
    );
}
