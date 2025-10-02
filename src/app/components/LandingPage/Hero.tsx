import ScrollAnimation from "../ScrollAnimation";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="hero-gradient text-white">
            <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32">
                <ScrollAnimation animation="animate-fade-in-up">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
                            Todo lo que necesitas para gestionar tu negocio freelance
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-xl">
                            La plataforma todo en uno para gestionar proyectos, tiempo, facturación y clientes. Diseñada específicamente para freelancers que buscan profesionalizar su negocio.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            <Link href="/register" className="px-6 py-3 rounded-md shadow-sm text-primary-hover bg-background hover:bg-background-secondary transition">
                                Prueba gratis
                            </Link>
                            <Link href="/dashboard" className="px-6 py-3 rounded-md shadow-sm text-foreground bg-primary bg-opacity-60 hover:bg-opacity-70 transition">
                                Ver demo
                            </Link>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    )
}