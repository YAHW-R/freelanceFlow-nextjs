# FreelanceFlow 🚀

**FreelanceFlow** es una plataforma integral diseñada para que los freelancers gestionen sus proyectos, clientes, tareas y finanzas de manera eficiente. Potenciada por Inteligencia Artificial, ayuda a automatizar el flujo de trabajo y ofrece una visión clara del progreso y la productividad.

## ✨ Características Principales

-   **Dashboard Inteligente:** Resumen visual de proyectos activos, tareas pendientes y métricas clave.
-   **Gestión de Proyectos:** Crea y organiza tus proyectos, asigna clientes y realiza un seguimiento detallado del progreso.
-   **Tablero Kanban de Tareas:** Organiza tu trabajo diario con un sistema de arrastrar y soltar (en desarrollo), prioridades y estados personalizables.
-   **Asistente IA (Gemini):** Un copiloto integrado que permite crear tareas y proyectos mediante lenguaje natural, además de responder consultas sobre tu gestión.
-   **Gestión de Clientes:** Directorio de contactos con historial de proyectos y facturación asociada.
-   **Métricas y Analíticas:** Gráficas interactivas para visualizar tu productividad y el estado de tus proyectos.
-   **Seguimiento de Tiempo:** Registra las horas invertidas en cada tarea para una facturación más precisa.
-   **Facturación:** Generación y gestión de facturas para tus clientes.

## 🛠️ Stack Tecnológico

-   **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Backend & Auth:** [Supabase](https://supabase.com/) (SSR)
-   **IA:** [Google Generative AI](https://ai.google.dev/) (Gemini 1.5 Flash)
-   **Gráficas:** [Recharts](https://recharts.org/)
-   **Iconos:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

## 🚀 Inicio Rápido

### Requisitos Previos

-   [Node.js](https://nodejs.org/) (v18 o superior)
-   Una cuenta en [Supabase](https://supabase.com/)
-   Una API Key de [Google AI Studio](https://aistudio.google.com/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/freelanceflow-web.git
    cd freelanceflow-web
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase

    # Google AI (Gemini)
    GOOGLE_API_KEY=tu_google_api_key
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📁 Estructura del Proyecto

```text
src/
├── app/              # Rutas (App Router), Layouts y Server Actions
│   ├── (auth)/       # Páginas de Login, Registro y Autenticación
│   ├── (dashboard)/  # Área principal de la aplicación (Proyectos, Tareas, etc.)
│   ├── (publicPage)/ # Landing page y páginas públicas
│   └── actions/      # Lógica de servidor (Server Actions)
├── components/       # Componentes de UI reutilizables
├── lib/              # Configuraciones de Supabase, tipos y utilidades
└── assets/           # Imágenes y recursos estáticos
```

## 📝 Scripts Disponibles

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Crea la versión de producción de la aplicación.
-   `npm run start`: Inicia la aplicación en modo producción.
-   `npm run lint`: Ejecuta ESLint para revisar el código.

## 🛡️ Base de Datos

El proyecto utiliza **Supabase (PostgreSQL)**. Asegúrate de tener las siguientes tablas creadas (o usa el editor SQL de Supabase para definirlas):
- `profiles`: Datos de usuario.
- `projects`: Información de los proyectos.
- `tasks`: Tareas asociadas a proyectos y usuarios.
- `clients`: Información de los clientes.
- `time_tracking`: Registros de tiempo.
- `invoices`: Facturas generadas.

---
Desarrollado con ❤️ para freelancers.
