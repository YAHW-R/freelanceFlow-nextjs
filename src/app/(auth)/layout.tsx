import AuthTopbar from "@/app/components/auth/Topbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <AuthTopbar />
            {/* Aquí podrías poner un logo grande, un footer simple, etc. */}
            {children}
        </div>
    );
}