/** Nombre de marca visible (ADR-014); el de la tienda y el icono salen de app.config.ts. */
const APP_NAME = "Alakito";

export const SHELL_STRINGS = {
  appName: APP_NAME,
  tabs: {
    feed: "Inicio",
    map: "Mapa",
    alerts: "Alertas",
    profile: "Perfil",
  },
  updateRequired: {
    title: "Actualiza la app",
    body: "Esta versión ya no es compatible. Descarga la versión nueva para seguir ayudando a las mascotas a volver a casa.",
    cta: "Ir a la tienda",
  },
  placeholder: {
    title: "Muy pronto",
    body: "Esta pantalla llega en las próximas secciones del plan.",
  },
  loading: "Cargando…",
  offline: {
    title: "Sin conexión",
    body: `No pudimos conectar con ${APP_NAME}. Revisa tu red e inténtalo de nuevo.`,
    retry: "Reintentar",
  },
} as const;
