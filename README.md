# flashBank Frontend
Dashboard de transacciones con scroll infinito, filtros y optimistic updates

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query v5
- nuqs (URL state)
- Vitest + Testing Library (para tests)

## Como correr el proyecto

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev
Abrir http://localhost:3000

# Estructura del proyecto
src/
    app/                 # rutas de Next.js (solo layout y page)
    features/            # logica por funcionalidad
        transactions/    # todo lo de transacciones
        hooks/           # usetransactionhistory
        types/           # tipos TypeScript
    components/          # componentes reutilizables
        ui/              # Skeleton, etc
        transaction-list/# transactionItem
    hooks/               # Hooks genericos (useDebounce)
    services/            # API mock
    lib/                 # configuraciones (react-query)

**Porque esta estructura.* 
porque separo por features porque cuando el proyecto crece es mas facil encontrar las cosas. Cada feature tiene su hook y sus tipos juntos. Los componentes reutilizables van en components/.

# Decisiones tecnicas
Use React Query porque ya lo conocia y tiene buen soporte para scroll infinito con useInfiniteQuery. Ademas maneja bien el cache y los optimistic updates

# Scroll infinito + virtualizacion
Hice scroll infinito con IntersectionObserver. Para virtualizacion no la implemente porque con 40 transacciones no hacia falta, pero si la lista creciera a miles usaria @tanstack/react-virtual para no renderizar todo de una vez.

# Stale time
configure staleTime en 5 minutos para que no recargue los datos cada vez que el usuario vuelve a la pagina

# Optimistic update
Al marcar una transaccion como revisada, la UI cambia instantaneamente y despues se confirma con el servidor. Si falla, vuelve atras.

# Filtros con URL
Use nuqs para guardar los filtros en la URL y asi si recargas la pagina o compartis el link, los filtros se mantienen.

# useMemo para filtros
Los filtros se calculan con useMemo para que no se recalquen en cada render si los datos no cambiaron.

# Server vs Client Components
En Next.js, esta pantalla necesita interactividad (filtros, scroll, botones), asi que todo es Client Component. Solo el layout tiene metadata y configuraciones basicas.

# Mock del API
Como no tenia el backend real, hice un mock local con datos fijos para desarrollo en produccion se reemplazaria por la URL real.