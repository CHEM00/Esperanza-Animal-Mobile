# Esperanza Animal · App móvil (Android e iOS)

Aplicación nativa de **Esperanza Animal**, la plataforma comunitaria del sur de
Veracruz para ayudar a las mascotas a volver a casa. Un proyecto de **sysosa**.
_«Porque ellos también son familia.»_

Este repositorio contiene la app de consumo para Android e iOS. El backend, la web y el
contrato de la API viven en el repositorio `esperanza-animal`. La herramienta interna de
personalización de collares NFC vive en un repositorio aparte.

## Estado

Fase de arquitectura y planificación. Toda la documentación está en [`docs/`](docs/README.md);
el código de la app se crea en la sección S10 del [plan de trabajo](docs/09-plan-de-trabajo.md).

## Documentación

| Documento | Contenido |
|---|---|
| [docs/README.md](docs/README.md) | Índice, glosario y convenciones |
| [01 Requisitos](docs/01-requisitos.md) | Todos los requisitos con identificador y parámetros de producto |
| [02 Arquitectura](docs/02-arquitectura.md) | Mapa de sistema, contenedores, componentes, flujos y patrones |
| [03 Modelo de datos](docs/03-modelo-de-datos.md) | Entidades nuevas y cambios sobre el esquema existente |
| [04 Seguridad NFC](docs/04-seguridad-nfc-sun.md) | NTAG 424 DNA, SUN, llaves, token de escaneo, amenazas |
| [05 Contrato de API](docs/05-api-contrato.md) | Principios, autenticación, endpoints y generación del contrato |
| [06 App móvil](docs/06-app-movil.md) | Estructura, patrones, navegación, diseño y pruebas |
| [07 Personalización de tags](docs/07-herramienta-personalizacion.md) | Herramienta interna en Kotlin |
| [08 Entorno y CI/CD](docs/08-entorno-y-cicd.md) | Máquinas, cuentas, firma, pipelines, variables |
| [09 Plan de trabajo](docs/09-plan-de-trabajo.md) | Secciones, tareas, criterios de aceptación y orden |
| [10 Preparación de tags](docs/10-preparacion-tags.md) | Qué debe existir el día que lleguen los chips |
| [ADR](docs/adr/README.md) | Registro de decisiones de arquitectura |

## Nombre del repositorio

El directorio se llama `Esperanza-Animal-Android` por su origen; el nombre acordado es
`Esperanza-Animal-Mobile` porque cubre ambas plataformas (ADR-005). El renombrado es una
acción manual pendiente.
