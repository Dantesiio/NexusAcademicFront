# NexusAcademic Front – Cliente Web

## 👥 Integrantes

* [David Donneys](https://github.com/Dantesiio)
* [Jhonatan Castaño](https://github.com/JhonatanCI)
* [Andrés Pino](https://github.com/AndresPin0)

---

## 📌 Descripción del Proyecto

**NexusAcademic Front** es la aplicación web desarrollada con **Next.js 14** y **TypeScript** que consume los servicios RESTful del backend de NexusAcademic (desarrollado en NestJS). Su propósito es facilitar la interacción de estudiantes, profesores y administradores con el sistema de gestión académica, ofreciendo una interfaz de usuario moderna, responsive y segura.

Este frontend implementa todas las funcionalidades críticas requeridas, incluyendo autenticación robusta con JWT, autorización granular basada en roles, gestión completa de entidades académicas (cursos, asignaciones, calificaciones), y una experiencia de usuario fluida con paginación, validaciones y retroalimentación clara.

---

## ⚙️ Requisitos Previos

* Node.js v18 o superior
* `pnpm` (recomendado), `npm` o `yarn`
* Acceso a una instancia en ejecución del backend NexusAcademic API.

---

## 🧪 Instalación y Configuración

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Dantesiio/NexusAcademicFront.git
   cd NexusAcademicFront
   ```

2. **Instalar dependencias:**

   ```bash
   pnpm install
   # o npm install / yarn install
   ```

3. **Configurar variables de entorno:**
   * Crear un archivo `.env.local` en la raíz del proyecto.
   * Añadir las siguientes variables:

       ```env
        DB_PASSWORD=password
        DB_NAME=prueba1
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=postgres
        NODE_ENV=development
        JWT_SECRET="prueba"
        PORT=3000
       
       # URL base de la API del backend
       NEXT_PUBLIC_API_URL=http://localhost:3001/api

       # Tamaño de página por defecto para listados paginados
       NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10

       ```

4. **Iniciar el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🚀 Funcionalidades Principales Implementadas

* **Autenticación Segura:** Login/logout con JWT, renovación automática de tokens.
* **Autorización Basada en Roles:** Múltiples roles (Admin, Profesor, Estudiante) con permisos específicos en UI y acceso a funcionalidades.
* **Gestión de Cursos:** CRUD completo para cursos, incluyendo asignación de profesores e inscripción de estudiantes.
* **Gestión de Asignaciones:** CRUD para tareas y trabajos, con soporte para descripciones enriquecidas y subida de archivos.
* **Gestión de Calificaciones:** Registro de notas por profesores y consulta por estudiantes.
* **Perfiles de Usuario:** Visualización y edición de información personal.
* **Dashboard Interactivo:** Métricas y datos relevantes según el rol del usuario.
* **Interfaz Intuitiva:** Diseño responsive, paginación, validaciones en formularios, notificaciones y manejo de errores.

---

## 🛠️ Stack Tecnológico y Decisiones de Diseño

* **Framework Principal:** Next.js 14 (App Router, Server Components y Client Components).
* **Lenguaje:** TypeScript.
* **Gestión de Estado:**
  * **Zustand:** Para estado global de la UI y sesión de usuario (autenticación, rol).
  * **React Query (TanStack Query):** Para fetching, caching, y sincronización de datos del servidor (cursos, asignaciones, etc.), maneja estados de carga, error y paginación.
* **Estilos:** Tailwind CSS para un desarrollo rápido y utility-first de la UI. Componentes Headless UI para accesibilidad.
* **Formularios:** React Hook Form con Zod para validaciones de esquemas.
* **Peticiones HTTP:** `fetch` API nativa, encapsulada en servicios o directamente en React Query.
* **Notificaciones:** Sistema de "toasts" para feedback al usuario (ej. `react-toastify` o similar).
* **Testing:**
  * **Unitario:** Jest y React Testing Library.
  * **End-to-End (E2E):** Playwright.
* **CI/CD:** GitHub Actions.

---

## ✅ Cumplimiento de Requisitos del Taller

A continuación, se detalla cómo este proyecto frontend satisface cada uno de los requisitos mínimos establecidos:

### 1. Autenticación (10%)

* **Sistema de autenticación JWT:**
  * Se implementa un flujo de inicio de sesión que envía credenciales al backend NestJS.
  * El backend responde con un JSON Web Token (JWT) si las credenciales son válidas.
  * Este token se almacena de forma segura (e.g., en una cookie HttpOnly o gestionado por el estado global si se usa como Bearer token para las API calls). El backend es responsable de la validación del JWT.
* **Iniciar y cerrar sesión:**
  * Existen formularios y lógica para que los usuarios inicien sesión.
  * Se provee una funcionalidad para cerrar sesión, que limpia el token almacenado y redirige al usuario.
* **Rutas protegidas:**
  * Se utiliza el middleware de Next.js (`middleware.ts`) y/o Componentes de Orden Superior (HOCs) para verificar la existencia y validez del token de autenticación antes de permitir el acceso a rutas que lo requieran. Los usuarios no autenticados son redirigidos a la página de login.

### 2. Autorización (10%)

* **Definición de roles:**
  * La aplicación maneja al menos tres roles: `ADMIN`, `PROFESOR`, y `ESTUDIANTE`. Estos roles son definidos y asignados por el backend y comunicados al frontend a través del JWT o un endpoint de perfil de usuario.
* **Permisos basados en roles:**
  * El acceso a ciertas rutas (e.g., panel de administración solo para `ADMIN`) está restringido.
  * Funcionalidades específicas (e.g., crear curso solo para `ADMIN` o `PROFESOR`, calificar solo para `PROFESOR`) están habilitadas o deshabilitadas según el rol del usuario.
* **Asignación de roles:**
  * La asignación se realiza en el backend. El frontend consume y respeta estos roles.
* **Gestión de roles en UI:**
  * Elementos de la interfaz (botones, enlaces de navegación, secciones completas) se muestran u ocultan dinámicamente utilizando el rol del usuario almacenado en el estado global (Zustand). Por ejemplo, un `Admin` verá opciones de menú que un `Estudiante` no verá.

### 3. Interfaz de Usuario (20%)

* **Interfaz atractiva y funcional:**
  * Se utilizan componentes de React y Tailwind CSS para crear una interfaz moderna, limpia y fácil de usar.
  * El diseño es responsive, adaptándose a diferentes tamaños de pantalla.
* **Páginas para listar, crear, editar y eliminar (CRUD):**
  * Se han implementado interfaces para las operaciones CRUD de las entidades principales (Cursos, Asignaciones, Usuarios - si aplica desde el frontend).
* **Paginación, validación, mensajes de error:**
  * **Paginación:** Los listados largos de datos (e.g., cursos) implementan paginación (gestionada con React Query y parámetros de API).
  * **Validación:** Los formularios utilizan `react-hook-form` y `zod` para validaciones del lado del cliente antes de enviar datos, mostrando mensajes de error específicos por campo.
  * **Mensajes de error:** Se utilizan notificaciones tipo "toast" (no `window.alert!`) para errores de API, validaciones y otros eventos importantes.
* **Sistema de navegación claro:**
  * Se implementa una barra de navegación principal y/o un menú lateral que facilita el acceso a las diferentes secciones de la aplicación, adaptándose según el rol del usuario.

### 4. Gestión del Estado (10%)

* **Solución para gestión del estado:**
  * Se utiliza **Zustand** para la gestión del estado global de la UI, como el estado de autenticación, información del usuario y preferencias de la aplicación.
  * **React Query (TanStack Query)** se usa para el estado del servidor (datos de la API), gestionando el fetching, caching, invalidación y sincronización.
* **Estado de autenticación y autorización centralizado:**
  * La información del usuario autenticado (incluyendo su token y rol) se almacena en el store de Zustand, accesible desde cualquier componente.
* **Estado de los datos principales:**
  * React Query maneja el estado de los datos como cursos, asignaciones, etc., reduciendo la necesidad de almacenarlos manualmente en Zustand y proporcionando funcionalidades out-of-the-box como caching y refetching.

### 5. Funcionalidades (25%)

* Se han implementado las funcionalidades específicas de la aplicación NexusAcademic, tales como:
  * Visualización detallada de cursos.
  * Inscripción/desinscripción de estudiantes a cursos (según rol).
  * Creación y entrega de asignaciones.
  * Registro y visualización de calificaciones.
  * Dashboard con información relevante para cada rol.
  * (Listar aquí otras funcionalidades clave implementadas).

### 6. Informe de Funcionalidades (10%)

* Este `README.md` sirve como parte del informe, detallando las funcionalidades y cómo se cumplen los requisitos.
* Adicionalmente, se podría generar un documento `FEATURES_REPORT.md` (como el que se proporcionó anteriormente) que profundice en las decisiones de diseño y arquitectura de cada característica.

### 7. Despliegue (5%)

* **Servicio en nube:**
  * La aplicación está configurada para ser desplegada en Vercel (u otra plataforma similar como Netlify, AWS Amplify). Vercel es ideal para proyectos Next.js.
* **Pipelines para pruebas y despliegue automatizado:**
  * Se utiliza **GitHub Actions** para configurar un pipeline de Integración Continua y Despliegue Continuo (CI/CD).
  * En cada `push` o `pull request` a ramas principales, el pipeline ejecuta:
    1. Instalación de dependencias.
    2. Linting y formateo de código.
    3. Pruebas unitarias y de integración.
    4. Pruebas E2E.
    5. Build de producción.
    6. Despliegue automático a Vercel si todos los pasos anteriores son exitosos en la rama principal.

### 8. Pruebas (10%)

* **Pruebas unitarias y E2E automatizadas:**
  * **Pruebas Unitarias:** Se utilizan Jest y React Testing Library para probar componentes individuales, hooks y utilidades. Estas pruebas se encuentran en directorios `__tests__` o archivos `*.test.tsx`.
  * **Pruebas End-to-End (E2E):** Se utiliza Playwright para simular interacciones de usuario completas a través de la aplicación (e.g., login, creación de un curso, envío de una asignación). Estas pruebas se encuentran típicamente en un directorio `/e2e` o `/tests-e2e`.
  * Ambos tipos de pruebas se ejecutan automáticamente en el pipeline de CI/CD.

### 9. Entrega

* El código fuente completo del proyecto se encuentra en este repositorio GitHub.
* Este archivo `README.md` incluye las instrucciones para ejecutar la aplicación y probar cada funcionalidad, además de detallar el cumplimiento de los requisitos.

---

## 🧪 Ejecución de Pruebas Localmente

1. **Pruebas Unitarias:**

   ```bash
   pnpm test
   # o para modo watch:
   pnpm test:watch
   ```

2. **Pruebas End-to-End (E2E) con Playwright:**

   Asegúrate de que la aplicación (frontend) y el backend estén corriendo.

   ```bash
   # Instalar navegadores para Playwright (solo la primera vez)
   pnpm exec playwright install

   # Ejecutar todas las pruebas E2E
   pnpm test:e2e

   # Para abrir la UI de Playwright y ver los tests en acción:
   pnpm test:e2e:ui
   ```

   Configura la `baseURL` en `playwright.config.ts` si es necesario.

---

## 🛠️ Solución de Problemas Comunes

* **Error de conexión con la API (`NEXT_PUBLIC_API_URL`):**
  * Verifica que la URL en tu archivo `.env.local` sea correcta y que el servidor backend esté corriendo y accesible en esa dirección.
* **Problemas de autenticación/autorización:**
  * Asegúrate de que el backend esté configurado correctamente para JWT y roles.
  * Borra las cookies de la aplicación en tu navegador y vuelve a intentar el login.
* **Fallos en pruebas E2E:**
  * Verifica que tanto el frontend como el backend estén activos y correctamente configurados antes de ejecutar las pruebas E2E.
  * Revisa los selectores y flujos en las pruebas; pueden necesitar ajustes si la UI ha cambiado.

---