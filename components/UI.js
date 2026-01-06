
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
                "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl",
                "shadow-2xl shadow-black/20",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            {children}
        </div>
    );
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
    const variants = {
        primary: "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:to-orange-400 active:scale-[0.98]",
        secondary: "bg-slate-800/50 text-slate-100 border border-white/10 hover:bg-slate-800/80 hover:border-white/20 active:scale-[0.98]",
        ghost: "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5"
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
                "w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all",
                "focus:border-orange-500/50 focus:bg-slate-800 focus:ring-4 focus:ring-orange-500/10",
                className
            )}
            {...props}
        />
    )
}

export function Label({ children, className, ...props }) {
    return (
        <label className={cn("block text-sm font-semibold text-slate-300 mb-2", className)} {...props}>
            {children}
        </label>
    )
}

export function Badge({ children, variant = 'default', className }) {
    const variants = {
        default: "bg-slate-800 text-slate-300 border-slate-700",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
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
