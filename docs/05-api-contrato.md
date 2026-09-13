# 05 · Contrato de API v1

## 1. Principios

- **Una sola fuente de verdad.** Cada endpoint se declara con esquemas Zod de entrada y
  salida; de ahí se genera el documento OpenAPI. La app no escribe tipos a mano.
- **Entradas delgadas.** Validar, autenticar, limitar, delegar al `service.ts` de la
  feature. La Server Action equivalente delega al mismo servicio.
- **Errores como datos.** `application/problem+json` (RFC 9457) con `code` estable.
- **Versionado por prefijo.** `/api/v1`. Los cambios compatibles se agregan; los
  incompatibles abren `/api/v2` y `v1` se mantiene mientras existan versiones de la app
  por debajo de `MIN_SUPPORTED_APP_VERSION` que lo usen.
- **Fechas en ISO 8601 UTC.** Coordenadas como números decimales. Identificadores opacos.

## 2. Autenticación

| Tipo | Mecanismo | Uso |
|---|---|---|
| Sesión de usuario | Better Auth con plugin **bearer**: la app envía `Authorization: Bearer <token>`; el token se obtiene del encabezado `set-auth-token` al iniciar sesión y se guarda en almacenamiento seguro | Todo lo que requiere usuario |
| Inicio de sesión nativo | `POST /api/auth/sign-in/social` con `idToken` para Google y Apple, obtenido del selector de cuentas nativo. Microsoft usa el flujo de navegador del sistema mediante el plugin Expo de Better Auth salvo que en implementación se confirme soporte de ID token | RF-A2 |
| Token de escaneo | Encabezado `x-scan-token` (política `scanToken`; esquema `scanToken` en el contrato) | Endpoints de hallazgo y activación |
| Administrador | Sesión con rol `admin` | Endpoints internos |
| Cron | `Authorization: Bearer <CRON_SECRET>` | `/api/ciclo-vida`, existente |

Orígenes de confianza: el esquema de la app y sus enlaces universales se registran en
`trustedOrigins` de Better Auth. Los identificadores de cliente OAuth móviles se declaran
en `GOOGLE_MOBILE_CLIENT_IDS` como audiencias válidas del ID token.

## 3. Convenciones

| Tema | Regla |
|---|---|
| Paginación | Cursor opaco: `?cursor=&limit=`; respuesta `{ items, nextCursor }`. `limit` acotado por la constante de la feature (`FEED_PAGE_SIZE`, `ALERTS_PAGE_SIZE`) |
| Subida de fotos | `multipart/form-data`; el servidor convierte a WebP con las reglas existentes; la app comprime antes con los mismos límites del navegador |
| Fotos | `GET /fotos/{id}` existente, con caché inmutable |
| Rate limit | Encabezados `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`; `429` con Problem Details |
| Correlación | La app envía `X-Request-Id`; el backend lo devuelve y lo loguea |
| Idioma | `es-MX`; los textos al usuario los decide la app a partir de `code` |
| Cache | `ETag` en recursos de lectura pesada (detalle, perfil de mascota) |

Códigos de problema (extracto): `auth.required`, `auth.suspended`, `validation.failed`,
`not_found`, `rate_limited`, `scan.invalid`, `scan.token_expired`, `scan.token_consumed`,
`scan.muted`, `scan.cooldown`, `scan.daily_limit`, `tag.not_activatable`,
`tag.under_review`, `pet.limit_reached`, `pet.not_owner`, `publication.daily_limit`,
`colonia.not_selectable`, `invite.expired`, `transfer.expired`, `app.update_required`.

## 4. Endpoints

`S` = sesión, `P` = público, `T` = token de escaneo, `A` = administrador. La columna
**Sección** enlaza con el plan de trabajo.

### Configuración y cuenta

| Método y ruta | Auth | Descripción | Sección |
|---|---|---|---|
| `GET /api/v1/config` | P | Versión mínima, proveedores OAuth, municipios activos, límites que la app valida en local | S1 |
| `GET /api/v1/me` | S | Usuario, rol, estado de onboarding, resumen de perfil | S1 |
| `PUT /api/v1/me/profile` | S | Colonia, especies, aviso de privacidad, alertas de colonia | S7 |
| `PUT /api/v1/me/contact` | S | Teléfonos y contacto de emergencia (cifrados) | S5 |
| `DELETE /api/v1/me` | S | Eliminar cuenta con palabra de confirmación | S7 |
| `GET /api/v1/colonias?cp=` | P | Búsqueda por código postal | S7 |

### Casos

| Método y ruta | Auth | Descripción | Sección |
|---|---|---|---|
| `GET /api/v1/publications?tab&species&cursor` | P | Feed por pestaña con paginación | S7 |
| `GET /api/v1/publications/{id}` | P | Detalle sin teléfono | S7 |
| `POST /api/v1/publications/{id}/phone` | S | Revela el teléfono (6g) | S7 |
| `POST /api/v1/publications` | S | Crear con fotos | S7 |
| `PATCH /api/v1/publications/{id}` | S | Editar, agregar y quitar fotos | S7 |
| `DELETE /api/v1/publications/{id}` | S | Eliminar | S7 |
| `POST` / `DELETE /api/v1/publications/{id}/found` | S | Marcar encontrada y revertir | S7 |
| `POST /api/v1/publications/{id}/reactivate` | S | Reactivar archivada | S7 |
| `GET /api/v1/me/publications`, `GET /api/v1/me/helped` | S | Perfil 3g | S7 |
| `POST /api/v1/publications/{id}/sightings` | S | Avistamiento con foto opcional | S7 |
| `PATCH /api/v1/sightings/{id}` | S | Ocultar o mostrar (dueño) | S7 |
| `POST /api/v1/publications/{id}/reports` | S | Reportar | S7 |
| `GET /api/v1/publications/{id}/trail` | P | Rastro de avistamientos en orden | S7 |

### Alertas, dispositivos y mapa

| Método y ruta | Auth | Descripción | Sección |
|---|---|---|---|
| `GET /api/v1/alerts?cursor` | S | Lista paginada | S7 |
| `GET /api/v1/alerts/unread-count` | S | Contador | S7 |
| `POST /api/v1/alerts/read-all` | S | Marcar leídas | S7 |
| `PUT /api/v1/devices` | S | Registrar o actualizar token push | S6 |
| `DELETE /api/v1/devices/{pushToken}` | S | Baja | S6 |
| `GET /api/v1/map/pins?bbox&kinds&zoom` | P (+S para escaneos) | Pines y clústeres del área visible | S7 |

### Mascotas y guardianes

| Método y ruta | Auth | Descripción | Sección |
|---|---|---|---|
| `GET /api/v1/pets` | S | Mis mascotas | S3 |
| `POST /api/v1/pets` | S | Crear con fotos | S3 |
| `GET /api/v1/pets/{id}` | S guardián | Detalle completo | S3 |
| `PATCH /api/v1/pets/{id}` | S dueño | Editar campos y preferencias | S3 |
| `DELETE /api/v1/pets/{id}` | S dueño | Pasa a `INACTIVA` | S3 |
| `POST /api/v1/pets/{id}/photos`, `DELETE .../photos/{photoId}`, `PATCH .../photos/order` | S dueño | Fotos | S3 |
| `POST` / `DELETE /api/v1/pets/{id}/lost` | S guardián | Modo perdido y regreso | S3 |
| `GET /api/v1/pets/{id}/scans?cursor` | S guardián | Historial de escaneos | S4 |
| `GET /api/v1/pets/{id}/public-preview` | S guardián | Lo que vería un finder | S4 |
| `GET /api/v1/pets/{id}/guardians` | S guardián | Lista | S3 |
| `POST /api/v1/pets/{id}/guardian-invites` | S dueño | Enlace de invitación | S3 |
| `POST /api/v1/guardian-invites/{code}/accept` | S | Aceptar | S3 |
| `DELETE /api/v1/pets/{id}/guardians/{userId}` | S dueño | Quitar guardián | S3 |
| `POST /api/v1/pets/{id}/transfers` | S dueño | Enlace de transferencia | S3 |
| `POST /api/v1/transfers/{code}/accept` | S | Aceptar | S3 |
| `POST /api/v1/transfers/{id}/cancel` | S dueño | Cancelar | S3 |

### Collar y escaneo

| Método y ruta | Auth | Descripción | Sección |
|---|---|---|---|
| `POST /api/v1/scans/nfc` | P, sesión opcional | Verifica `{p, m}`, resuelve vista, emite token | S2 |
| `POST /api/v1/scans/qr` | P, sesión opcional | Igual con `{code}` y nivel sin verificar | S4 |
| `GET /api/v1/scans/{token}` | T | Estado de la sesión de escaneo y datos públicos de la mascota | S4 |
| `POST /api/v1/scans/{token}/finder-report` | T | Aviso al dueño con mensaje, ubicación aproximada, foto y teléfono opcional | S4 |
| `POST /api/v1/scans/{scanId}/suspicious` | S guardián | Marca sospechoso; el tag entra a revisión | S4 |
| `POST /api/v1/tags/activate` | S + T | `{scanToken, petId}` | S3 |
| `POST` / `DELETE /api/v1/tags/{id}/mute` | S dueño | Silenciar | S4 |
| `POST /api/v1/tags/{id}/unlink` | S dueño | Desvincular; el tag vuelve a `LISTO` | S3 |

### Páginas web del flujo (no son API)

| Ruta | Descripción | Sección |
|---|---|---|
| `GET /t?p&m` | Verifica y redirige a `/encontre/{token}`; en modo diagnóstico muestra el resultado | S2 |
| `GET /q/{code}` | Camino QR | S4 |
| `GET /encontre/{token}` | Vista de finder | S4 |
| `GET /collar` | Pantalla neutra | S2 |

### Internos (herramienta de personalización y administración)

| Método y ruta | Auth | Descripción | Sección |
|---|---|---|---|
| `POST /api/v1/internal/lots` | A | Alta de lote con UIDs | S8 |
| `POST /api/v1/internal/tags/{uid}/keys` | A | Llaves derivadas y `keyVersion`; bitácora | S8 |
| `POST /api/v1/internal/tags/{uid}/provisioned` | A | Verifica la lectura de prueba y marca `LISTO` | S8 |
| `POST /api/v1/internal/tags/{uid}/revoke` | A | Revocar con motivo | S8 |
| `POST /api/v1/internal/tags/{uid}/review` | A | Resolver `EN_REVISION` | S8 |

## 5. Esquemas principales

Los nombres son los de los esquemas Zod que se exportan desde `schemas.ts` de cada feature
y que el generador convierte en componentes OpenAPI.

| Esquema | Contenido |
|---|---|
| `configSchema` | `minSupportedAppVersion`, `oauthProviders[]`, `activeMunicipios[]`, `limits { maxPhotos, maxPhotoBytes, ... }`, `mapDefaults` |
| `meSchema` | `user { id, name, image, role }`, `onboardingComplete`, `profile { coloniaId, colonia, species[], notifyColonia }`, `petCount` |
| `publicationSummarySchema` | Tarjeta del feed: id, nombre, especie, estado, colonia, portada, tiempo, avistamientos, `hasNfcTag` |
| `publicationDetailSchema` | Detalle sin teléfono; `phoneMasked`; avistamientos visibles; `petId?` |
| `petSummarySchema`, `petDetailSchema` | Para guardianes |
| `petPublicViewSchema` | Nombre, foto, estado, mensaje según estado, `phone?` solo con opt-in, `medicalNotes?` solo con opt-in |
| `scanResolutionSchema` | `view`, `trustLevel`, `scanToken?`, `expiresAt`, `tagStatus`, `pet?` (`petPublicViewSchema` o `petDetailSchema` según vista) |
| `finderReportInputSchema` | `message?`, `approxLat?`, `approxLng?`, `phone?`, foto multipart, `locationConsent` |
| `deviceRegistrationSchema` | `platform`, `pushToken`, `appVersion`, `osVersion?`, `model?`, `locale?` |
| `alertSchema` | Tipo, texto, fecha, `readAt`, enlace profundo de destino |
| `mapPinsResponseSchema` | `pins[]` de tipo `lost | sighting | found | scan` y `clusters[] { lat, lng, count, bbox }` |
| `problemSchema` | `type`, `title`, `status`, `detail`, `code`, `errors?` por campo |

## 6. Generación del contrato y del cliente

| Paso | Dónde | Comando |
|---|---|---|
| Declarar la ruta con `defineRouteSpec` en `features/<feature>/spec.ts` y registrarla en `lib/api/v1-specs.ts` | repo web | — |
| Implementarla con `implementRoute` en `src/app/api/v1/.../route.ts` | repo web | — |
| Generar `contract/openapi.json` (snapshot de archivo de Vitest) | repo web | `npm run contract:build` |
| Verificar que el contrato commiteado coincide con el código | CI del repo web, también dentro de `npm test` | `npm run contract:check` |
| Generar tipos y cliente | este repo, `src/core/api/generated` | `npm run api:generate` contra la versión fijada en `contract.lock.json` |
| Verificar que el cliente generado coincide | CI de este repo | `npm run api:check` |

El generador (`lib/api/openapi.ts`) usa la conversión a JSON Schema 2020-12 de Zod 4, el
dialecto de OpenAPI 3.1, sin librerías adicionales. Los esquemas registrados con
`registerApiSchema` se publican como componentes con nombre; el resto va en línea.

El cliente generado es de bajo nivel y tipado. Los repositorios de cada feature (documento
06) lo envuelven; ninguna pantalla lo importa directamente.

## 7. Compatibilidad

- Un campo nuevo en una respuesta es compatible. Un campo eliminado o renombrado no.
- Un endpoint se marca `deprecated` en el contrato al menos una versión de la app antes
  de retirarlo.
- `GET /api/v1/config` es el primer request de la app; si la versión instalada es menor a
  `minSupportedAppVersion`, la app muestra la pantalla de actualización obligatoria.
