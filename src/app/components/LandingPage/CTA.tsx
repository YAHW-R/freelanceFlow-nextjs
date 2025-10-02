import Link from "next/link"
import ScrollAnimation from "../ScrollAnimation"

export default function CTA() {
    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto text-center">
                <ScrollAnimation animation="animate-fade-in" className="bg-primary-hover rounded-lg py-12 px-6">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                        ¿Listo para transformar tu negocio freelance?
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-foreground-secondary mx-auto">
                        Comienza gratis hoy mismo y descubre cómo FreelanceHub puede ayudarte.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link href="/register" className="px-6 py-3 rounded-md shadow-sm text-foreground bg-primary hover:bg-primary-hover transition">
                            Crear cuenta gratis
                        </Link>
                    </div>
                    <p className="mt-4 text-sm text-foreground-secondary">Sin tarjeta de crédito requerida.</p>
                </ScrollAnimation>
            </div>
        </section>
    )
}