import TopBar from "../components/LandingPage/Topbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <TopBar />
            {/* Aquí podrías poner un logo grande, un footer simple, etc. */}
            {children}
        </div>
    );
}