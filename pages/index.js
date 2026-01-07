import Calculator from '../components/Calculator';
import { Header, Footer } from '../components/Branding';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />
            <main className="p-4 md:p-8 lg:p-12 relative">
                <div className="max-w-7xl mx-auto">
                    <Calculator />
                </div>
            </main>
            <Footer />
        </div>
    );
}
