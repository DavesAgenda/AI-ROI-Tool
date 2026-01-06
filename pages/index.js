import Calculator from '../components/Calculator';

export default function Home() {
    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black">
            <div className="max-w-7xl mx-auto">
                <Calculator />
            </div>
        </main>
    );
}
