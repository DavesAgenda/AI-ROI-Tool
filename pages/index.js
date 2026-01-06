import Calculator from '../components/Calculator';

export default function Home() {
    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <Calculator />
            </div>
        </main>
    );
}
