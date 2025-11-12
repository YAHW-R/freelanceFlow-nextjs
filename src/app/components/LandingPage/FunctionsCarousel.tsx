"use client";
import { useState } from "react";
import {
    LuFolder,
    LuClock,
    LuUsers,
    LuChartColumn,
    LuBrainCircuit,
} from "react-icons/lu";

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

const FunctionsCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {features.map((feature, i) => (
                    <div key={i} className="w-full flex-shrink-0">
                        <div className="text-left bg-background-secondary rounded-xl shadow-md p-6 border border-background hover:shadow-lg transition">
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
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {features.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleDotClick(i)}
                        className={`h-3 w-3 rounded-full ${
                            activeIndex === i ? "bg-primary" : "bg-gray-400"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FunctionsCarousel;