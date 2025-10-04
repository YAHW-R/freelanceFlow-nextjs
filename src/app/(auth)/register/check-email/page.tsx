export default function CheckEmailPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
            <div className="bg-background-secondary p-8 rounded shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">¡Gracias por registrarte!</h1>
                <p className="mb-4">Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar tu registro.</p>
                <p className="text-sm text-foreground-secondary">Si no ves el correo, revisa tu carpeta de spam o intenta registrarte nuevamente.</p>
            </div>
        </div>
    );
}