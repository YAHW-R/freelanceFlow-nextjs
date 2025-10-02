import {
    LuFolder,
    LuClock,
    LuDollarSign,
    LuUsers,
    LuChartColumn,
    LuBrainCircuit,
} from "react-icons/lu";



export default function Funcionalidades() {

    const features = [
        {
            icon: LuFolder,
            title: "Gestión de Proyectos",
            items: [
                "Tableros visuales para organizar tus trabajos",
                "Sistema de milestones y entregables",
                "Plantillas personalizables para diferentes tipos de proyectos",
            ],
        },
        {
            icon: LuClock,
            title: "Control de Tiempo",
            items: [
                "Timer integrado para registrar horas trabajadas",
                "Reportes automáticos de productividad",
                "Seguimiento de tiempo por proyecto y cliente",
            ],
        },
        {
            icon: LuDollarSign,
            title: "Facturación Profesional",
            items: [
                "Generador de facturas personalizables",
                "Recordatorios automáticos de pagos pendientes",
                "Integración con Stripe y PayPal",
            ],
        },
        {
            icon: LuUsers,
            title: "Gestión de Clientes",
            items: [
                "Base de datos centralizada de clientes",
                "Historial de comunicaciones y proyectos",
                "Sistema de contratos digitales",
            ],
        },
        {
            icon: LuChartColumn,
            title: "Dashboard Analítico",
            items: [
                "Métricas clave de tu negocio freelance",
                "Proyecciones de ingresos y gastos",
                "Análisis de rentabilidad por proyecto",
            ],
        },
        {
            icon: LuBrainCircuit,
            title: "Integración con Inteligencia Artificial",
            items: [
                "Descripciones y Ayudas generadas por IA",
                "Asistente para redacción de propuestas",
                "Sugerencias de optimización de tiempo y recursos",
            ],
        },
    ];

    return (
        <div className="bg-background text-foreground min-h-screen">
            {/* Hero Section */}
            <section className="hero-gradient text-foreground py-20 px-6 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl animate-fade-in-up">
                    Funcionalidades de FreelanceHub
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg animate-fade-in-up animate-delay-100">
                    Todas las herramientas que necesitas para gestionar tu negocio freelance en un solo lugar.
                </p>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`bg-background-secondary rounded-xl shadow-md p-6 border border-background hover:shadow-lg transition animate-fade-in-up animate-delay-${i + 1}00`}
                        >
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-background-secondary text-primary mb-4">
                                {<feature.icon className="h-6 w-6" aria-hidden="true" />}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">
                                {feature.title}
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-foreground-secondary">
                                {feature.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
