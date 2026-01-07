import React from 'react';

export function Header() {
    return (
        <header className="bg-[#134061] h-16 flex items-center px-4 md:px-8 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <img src="/assets/va-logo-wide.png" alt="Valid Agenda" className="h-8 w-auto" />
                <div className="text-white/80 text-sm font-semibold hidden md:block uppercase tracking-widest">
                    AI Payback Tool
                </div>
            </div>
        </header>
    );
}

export function Footer() {
    return (
        <footer className="bg-[#134061] py-12 px-4 md:px-8 mt-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img src="/assets/va-logo-wide.png" alt="Valid Agenda" className="h-6 w-auto" />
                    <p className="text-white/60 text-sm max-w-sm text-center md:text-left">
                        We help finance and ops teams build their first payback-generating agents in 30 days.
                    </p>
                </div>
                <div className="flex gap-8 text-white/80 text-sm font-semibold">
                    <a href="https://validagenda.com" target="_blank" rel="noreferrer" className="hover:text-[#F48847] transition-colors">Website</a>
                    <a href="https://validagenda.com/book" target="_blank" rel="noreferrer" className="hover:text-[#F48847] transition-colors">Book a Call</a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto w-full mt-12 pt-8 border-t border-white/5 text-center text-white/40 text-xs text-center">
                &copy; {new Date().getFullYear()} Valid Agenda. All rights reserved.
            </div>
        </footer>
    );
}
