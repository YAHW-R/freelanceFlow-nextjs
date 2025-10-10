import ScrollAnimation from "../ScrollAnimation"
import { LuFolder, LuClock, LuDollarSign, LuUser } from "react-icons/lu"

export default function Feutures() {
    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4">
                <ScrollAnimation animation="animate-fade-in-up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                            Simplifica tu flujo de trabajo freelance
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-foreground-secondary mx-auto">
                            Todas las herramientas que necesitas en un solo lugar.
                        </p>
                    </div>
                </ScrollAnimation>


                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {["folder", "clock", "dollar-sign", "users"].map((icon, i) => (
                        <ScrollAnimation key={i} animation={`animate-fade-in-up`} className={`animate-delay-${i + 1}00`}>
                            <div className={`feature-card bg-background-secondary p-6 rounded-lg shadow-md transition`}>
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-hover text-primary">
                                    {icon === "folder" && <LuFolder className="h-6 w-6 text-background-secondary" />}
                                    {icon === "clock" && <LuClock className="h-6 w-6 text-background-secondary" />}
                                    {icon === "dollar-sign" && <LuDollarSign className="h-6 w-6 text-background-secondary" />}
                                    {icon === "users" && <LuUser className="h-6 w-6 text-background-secondary" />}
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-foreground">
                                    {icon === "folder" && "Gestión de Proyectos"}
                                    {icon === "clock" && "Control de Tiempo"}
                                    {icon === "dollar-sign" && "Facturación"}
                                    {icon === "users" && "Administración de Clientes"}
                                </h3>
                                <p className="mt-2 min-h-24 text-base text-foreground-secondary">
                                    {icon === "folder" && "Organiza proyectos con kanban, tareas y seguimiento de progreso."}
                                    {icon === "clock" && "Reportes de horas trabajadas. Analiza tu productividad semanal/mensual."}
                                    {icon === "dollar-sign" && "Genera facturas profesionales y realiza avisos, analiza ingresos y gestiona los presupuestos."}
                                    {icon === "users" && "Integración con datos de clientes, reportes y avisos de pago con informes de horas trabajadas y tareas realizadas."}
                                </p>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>

    )
}