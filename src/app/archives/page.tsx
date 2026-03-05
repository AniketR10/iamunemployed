import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function ArchiveInterviewsPage() {
  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />
      
      <div className="grow flex items-center justify-center p-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
          Coming Soon
        </h1>
      </div>

      <Footer />
    </div>
  );
}