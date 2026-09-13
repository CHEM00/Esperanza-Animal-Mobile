# Registro de decisiones de arquitectura (ADR)

Cada decisión relevante queda escrita con su contexto, alternativas y consecuencias. Una
ADR no se edita para cambiar la decisión: se escribe una nueva que la reemplaza y la
anterior pasa a estado «Reemplazada por ADR-xxx».

| ADR | Decisión | Estado |
|---|---|---|
| [001](ADR-001-react-native-expo.md) | React Native + Expo para la app de consumo | Aceptada |
| [002](ADR-002-tag-apunta-a-mascota.md) | El tag NFC se vincula a la mascota, no al dueño | Aceptada |
| [003](ADR-003-verificacion-sun-en-servidor.md) | La verificación SUN vive en el servidor; la app no hace criptografía NFC | Aceptada |
| [004](ADR-004-cifrado-en-reposo.md) | Cifrado de datos personales en reposo con cifrado de sobre | Aceptada |
| [005](ADR-005-repositorios.md) | Un repo móvil, un repo de herramienta, contrato en el backend | Aceptada |
| [006](ADR-006-contrato-openapi.md) | Contrato OpenAPI generado desde Zod; clientes generados | Aceptada |
| [007](ADR-007-personalizacion-separada.md) | La personalización de tags es una herramienta interna separada | Aceptada |
| [008](ADR-008-niveles-de-confianza.md) | Dos niveles de confianza: NFC verificado y QR sin verificar | Aceptada |
| [009](ADR-009-push-nativo.md) | Push móvil: FCM en Android y APNs en iOS detrás de un puerto | Aceptada |
| [010](ADR-010-finder-web-first.md) | La pantalla de quien encuentra es web primero; App Clip después | Aceptada |
| [011](ADR-011-sin-direccion-del-dueno.md) | No se almacena la dirección del dueño | Aceptada |
