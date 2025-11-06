import Sidebar from "@/app/components/layout/Sidebar";
import Topbar from "@/app/components/layout/Topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Topbar /> {/* Aquí iría tu Topbar */}
                <main className="flex-1 p-4 md:p-8">
                    {children} {/* Aquí se renderizarán las páginas del dashboard */}
                </main>
            </div>
        </div>
    );
}