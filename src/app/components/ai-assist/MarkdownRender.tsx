// @/app/components/MarkdownRenderer.tsx
'use client'; // Asegúrate de que sea un Client Component

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Todavía útil para tablas, listas de tareas, etc.

interface MarkdownRendererProps {
    content: string;
    className?: string; // Para pasar clases CSS adicionales al contenedor
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    if (!content) return null;

    return (
        // Aplicamos 'prose' para estilos básicos de Markdown y 'dark:prose-invert' para modo oscuro.
        // 'max-w-none' es útil para que no limite el ancho del chat.
        <div className={`prose dark:prose-invert max-w-none ${className || ''}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]} // Todavía mantiene soporte para GFM como tablas, tachado.
                components={{
                    // Aquí personalizamos solo los elementos que SI quieres que Markdown genere.
                    // Hemos quitado la personalización del bloque de código.
                    a: ({ ...props }) => <a {...props} className="text-primary hover:underline" />,
                    table: ({ ...props }) => <table {...props} className="table-auto w-full text-left border-collapse border border-gray-300 dark:border-gray-700" />,
                    th: ({ ...props }) => <th {...props} className="p-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 font-semibold" />,
                    td: ({ ...props }) => <td {...props} className="p-2 border border-gray-300 dark:border-gray-700" />,
                    // Si no quieres personalizar un elemento, simplemente no lo incluyas aquí
                    // y ReactMarkdown usará la etiqueta HTML por defecto (ej. <p>, <strong>, <em>, <ul>, <ol>)
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}