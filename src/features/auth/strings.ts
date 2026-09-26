export const AUTH_STRINGS = {
  title: "Entra para ayudar",
  subtitle:
    "Ver los casos es libre. Para publicar, avisar de un avistamiento o registrar a tu mascota, entra con tu cuenta.",
  providers: {
    google: "Continuar con Google",
    apple: "Continuar con Apple",
  },
  privacyNote:
    "Solo usamos tu cuenta para identificarte. No publicamos nada en tu nombre.",
  noProviders: "Ningún proveedor de inicio de sesión está disponible en este dispositivo.",
  cancelled: "Inicio de sesión cancelado.",
  unavailable: "Ese proveedor no está disponible en este dispositivo.",
  failed: "No se pudo iniciar sesión. Inténtalo de nuevo.",
  skip: "Seguir sin cuenta",
  devSession: {
    title: "Sesión de desarrollo",
    hint: "Solo en builds de desarrollo y Expo Go. Pega el token que imprime scripts/dev-session.mjs del backend.",
    label: "Token de sesión",
    placeholder: "Pega aquí el token",
    action: "Entrar con el token",
    invalid: "El token está vacío o no se pudo guardar.",
  },
} as const;
