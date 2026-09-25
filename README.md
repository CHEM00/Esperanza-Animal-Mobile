# Esperanza Animal · App móvil (Android e iOS)

Aplicación nativa de **Esperanza Animal**, la plataforma comunitaria del sur de
Veracruz para ayudar a las mascotas a volver a casa. Un proyecto de **sysosa**.
_«Porque ellos también son familia.»_

Este repositorio contiene la app de consumo para Android e iOS, construida con React
Native y Expo. El backend, la web y el contrato de la API viven en el repositorio
`esperanza-animal`. La herramienta interna de personalización de collares NFC vive en
un repositorio aparte.

## Estado

Backend: secciones S1 a S4 del [plan](docs/09-plan-de-trabajo.md) implementadas y probadas
en vivo en el repositorio `esperanza-animal` (API v1, verificador NFC, mascotas y collar,
hallazgo y alertas). App: cimientos implementados (sección S10):
configuración validada, cliente tipado por contrato, sesión con proveedores nativos,
tema con los tokens de la web, pestañas nativas y puerta de actualización obligatoria.
Las pantallas de negocio llegan en las secciones S11 a S14.

## Puesta en marcha

Requisitos: Node 24, el repositorio del backend a mano y, para compilar, una cuenta de
Expo (EAS). Sin Mac se compila iOS en la nube.

```bash
npm ci
cp .env.example .env            # identidad de la app y URL del backend local
WEB_REPO_PATH=../esperanza-animal npm run contract:pull   # copia contract/openapi.json
npm run api:generate            # tipos del cliente desde el contrato
WEB_REPO_PATH=../esperanza-animal npm run tokens:sync     # colores y radios desde la web
npm start                       # Metro; la app necesita una build de desarrollo
```

La app usa módulos nativos (Google Sign-In, Apple, almacenamiento seguro), así que no
corre en Expo Go: se instala una **build de desarrollo** con EAS
(`eas build --profile development`) o localmente con Android Studio.

## Estructura

```
app/            Rutas de Expo Router: solo componen pantallas
config/         Configuración de build (app.config.ts la lee) y rutas de enlaces
contract/       Copia versionada del contrato OpenAPI del backend
scripts/        Sincronización de contrato y tokens
src/core/       Configuración, API, sesión, tema, navegación, puertos y adaptadores
src/features/   Una carpeta por dominio: pantallas, hooks, repositorio, textos
src/shared/ui/  Primitivas de interfaz con los tokens de marca
docs/           Arquitectura, requisitos, plan por secciones y ADR
```

Reglas del proyecto (docs/06):

- **Cero valores mágicos.** Identidad y dominios en `.env` y `config/`; límites de
  producto llegan del backend por `GET /api/v1/config`; colores del archivo generado.
- **Capas.** Las rutas no tienen lógica; la UI no importa el cliente HTTP generado ni
  adaptadores de dispositivo (ESLint lo impide).
- **Contrato primero.** `npm run api:check` y `npm run tokens:check` fallan en CI si el
  cliente o los tokens no coinciden con lo commiteado.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Metro para una build de desarrollo |
| `npm run lint` / `typecheck` / `test` | Calidad |
| `npm run contract:pull` | Copia el contrato del backend (`WEB_REPO_PATH`) |
| `npm run api:generate` / `api:check` | Genera o verifica los tipos del cliente |
| `npm run tokens:sync` / `tokens:check` | Genera o verifica los tokens de diseño |
| `npm run doctor` | Diagnóstico de Expo |

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
