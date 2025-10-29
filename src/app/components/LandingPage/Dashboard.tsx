import ScrollAnimation from "../ScrollAnimation"
import Image from "next/image"

import imageDashboard from "@/assets/dashboard-mockup.png"

import { LuCheck } from "react-icons/lu"

export default function Dashboard() {
    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-12 lg:gap-8">
                <ScrollAnimation animation="animate-fade-in-left" className="lg:col-span-6 bg-background-secondary p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                        Panel de control intuitivo
                    </h2>
                    <p className="mt-3 text-lg text-foreground-secondary">
                        Visualiza todas las métricas clave de tu negocio freelance en un dashboard personalizable.
                    </p>
                    <ul className="mt-8 space-y-6">
                        <li className="flex">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-foreground">
                                    <LuCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="ml-3 text-base text-foreground-secondary">
                                Proyecciones de ingresos y análisis de rentabilidad por proyecto
                            </p>
                        </li>
                        <li className="flex">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-foreground">
                                    <LuCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="ml-3 text-base text-foreground-secondary">
                                Gráficos de flujo de trabajo y carga laboral
                            </p>
                        </li>
                        <li className="flex">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-foreground">
                                    <LuCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="ml-3 text-base text-foreground-secondary">
                                Alertas y recordatorios automáticos para pagos y deadlines
                            </p>
                        </li>
                    </ul>
                </ScrollAnimation>
                <ScrollAnimation animation="animate-fade-in-right" className="mt-12 lg:mt-0 lg:col-span-6">
                    <div className="bg-background-secondary w-full lg:w-auto rounded-lg shadow-xl overflow-hidden aspect-[3/2] relative h-0" style={{ paddingBottom: '75%' }}>
                        <Image
                            src={imageDashboard}
                            alt="Dashboard preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    )
}   