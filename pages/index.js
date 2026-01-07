import Calculator from '../components/Calculator';

export default function Home() {
    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-white relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-slate-900" />
            <div className="max-w-7xl mx-auto">
                <Calculator />
            </div>
        </main>
    );
}
