// TourEase — Dashboard Layout (protected)
import Sidebar from '@/components/layout/sidebar';
import Navbar  from '@/components/layout/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
