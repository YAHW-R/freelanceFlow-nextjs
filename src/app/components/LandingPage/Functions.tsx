import {
    LuFolder,
    LuClock,
    LuUsers,
    LuChartColumn,
    LuBrainCircuit,
} from "react-icons/lu";


const Functions = () => {
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
}

export default Functions;