# 01 · Requisitos

Cada requisito tiene un identificador estable. `RF` funcional, `RNF` no funcional, `SEG`
seguridad, `LEG` legal, `ENT` entorno. La columna **Origen** indica si el requisito ya
existe en la web (`web`) y la app debe igualarlo, o si es nuevo (`nuevo`) y exige cambios en
el backend. Los valores numéricos viven en la sección 5 como parámetros con nombre.

## 0. Alcance

Dentro: app móvil para Android e iOS, extensiones del backend para servirla, sistema de
collares NFC, herramienta interna de personalización, páginas web del flujo de hallazgo.
Fuera (fases posteriores, sección 6): App Clip, chat efímero, SMS, widgets, Live Activities.
Fuera por decisión (ADR-013): pedidos, pagos y envíos del collar; la venta es externa.

## 1. Actores

| Actor | Descripción |
|---|---|
| Visitante | Ve casos y mapa sin sesión. Igual que en la web. |
| Usuario | Sesión OAuth. Publica, avista, reporta, recibe alertas. |
| Guardián | Usuario vinculado a una mascota. `DUENO` (uno por mascota) o `GUARDIAN`. |
| Finder | Persona que escanea un collar. Normalmente sin app ni sesión. |
| Administrador | Rol `admin` existente. Modera y gestiona tags y lotes desde la web. |
| Operador de personalización | Administrador que usa la herramienta interna con chips en mano. |
| Sistema | Tareas programadas: ciclo de vida, purgas, agrupación de alertas. |

## 2. Requisitos funcionales

### A. Cuenta y sesión

| Id | Requisito | Origen |
|---|---|---|
| RF-A1 | Inicio de sesión solo con proveedores OAuth de terceros: Google, Microsoft y Apple. Sin correo y contraseña. | web |
| RF-A2 | En la app el inicio de sesión usa el selector de cuentas nativo del sistema y entrega un ID token al backend; no abre un navegador. | nuevo |
| RF-A3 | En iOS se ofrece Sign in with Apple siempre que se ofrezca Google (regla 4.8 de App Store). | nuevo |
| RF-A4 | Un proveedor aparece solo si sus credenciales están configuradas en el entorno del backend. | web |
| RF-A5 | La sesión móvil se mantiene con token portador guardado en almacenamiento seguro del dispositivo. | nuevo |
| RF-A6 | Onboarding en el primer inicio: colonia por código postal, especies de interés y aceptación del aviso de privacidad. La colonia debe pertenecer a un municipio activo. | web |
| RF-A7 | Eliminación de cuenta desde la app con la misma palabra de confirmación y las mismas reglas que la web; los administradores no pueden autoeliminarse. | web |
| RF-A8 | Un usuario suspendido puede ver pero no publicar, avistar ni reportar. | web |

### B. Perfil y datos de contacto del dueño

| Id | Requisito | Origen |
|---|---|---|
| RF-B1 | El perfil conserva colonia, municipio, especies de interés y preferencia de alertas de colonia. | web |
| RF-B2 | El perfil agrega teléfono principal, teléfono alterno y contacto de emergencia (nombre y teléfono). Todos cifrados en reposo. | nuevo |
| RF-B3 | No se recolecta ni almacena la dirección del dueño. | nuevo (ADR-011) |
| RF-B4 | Los teléfonos se normalizan con las mismas reglas que las publicaciones (diez dígitos, lada nacional). | web |

### C. Mascotas

| Id | Requisito | Origen |
|---|---|---|
| RF-C1 | Un usuario crea perfiles de mascota: nombre, especie (perro, gato, otro con detalle), sexo, señas, fotos, fecha aproximada de nacimiento, esterilización, microchip y notas médicas opcionales. | nuevo |
| RF-C2 | Fotos de mascota: mismas reglas de cantidad, peso y conversión a WebP que las publicaciones. La primera es la portada. | web (reglas) |
| RF-C3 | Cada mascota tiene un código público no adivinable para el QR impreso y para compartir el perfil. | nuevo |
| RF-C4 | La mascota tiene estado `EN_CASA`, `PERDIDA` o `INACTIVA`. | nuevo |
| RF-C5 | Activar modo perdido crea un caso (publicación) prellenado con los datos y fotos de la mascota, siguiendo el flujo de avisos 3d y 3e. El caso queda vinculado a la mascota. | nuevo |
| RF-C6 | Confirmar el regreso marca el caso como `ENCONTRADA` con las reglas existentes y devuelve la mascota a `EN_CASA`. | nuevo |
| RF-C7 | El dueño decide qué ve un finder: el nombre y la foto siempre; el teléfono directo y las notas médicas solo si los activa. | nuevo |
| RF-C8 | Un usuario puede tener varias mascotas, hasta `MAX_PETS_PER_USER`. | nuevo |
| RF-C9 | El código de microchip implantado es inmutable una vez capturado; solo un administrador lo corrige con motivo y bitácora. | nuevo (S19) |
| RF-C10 | Todo cambio del perfil de la mascota queda en un historial visible a sus guardianes; cambiar nombre, fotos o microchip alerta a los demás guardianes. | nuevo (S19) |

### D. Guardianes y transferencia

| Id | Requisito | Origen |
|---|---|---|
| RF-D1 | Una mascota tiene exactamente un `DUENO` y hasta `MAX_GUARDIANS_PER_PET` guardianes. | nuevo |
| RF-D2 | El dueño invita guardianes con un enlace de un solo uso que caduca en `GUARDIAN_INVITE_TTL_HOURS`. | nuevo |
| RF-D3 | Todos los guardianes reciben las alertas de la mascota; solo el dueño transfiere, elimina o desvincula el collar. | nuevo |
| RF-D4 | Transferencia de mascota: el dueño la inicia con un enlace; el receptor la acepta; caduca en `PET_TRANSFER_TTL_DAYS`. Un administrador puede resolverla con motivo y bitácora. | nuevo |

### E. Collar y tag

| Id | Requisito | Origen |
|---|---|---|
| RF-E1 | Los tags se dan de alta por lote con proveedor, fecha, cantidad y UIDs. Un lote puede revocarse completo. | nuevo |
| RF-E2 | Un tag pasa por los estados `FABRICADO`, `LISTO`, `ACTIVO`, `EN_REVISION`, `REVOCADO` según la tabla de transiciones del documento 04. | nuevo |
| RF-E3 | El dueño activa un collar desde la app acercando el teléfono: el escaneo verificado más la elección de la mascota vinculan el tag. | nuevo |
| RF-E4 | El tag se vincula a una mascota, nunca a un usuario. Se conserva el historial de asignaciones. | nuevo (ADR-002) |
| RF-E5 | El dueño puede desvincular el collar, silenciarlo por `TAG_MUTE_DEFAULT_HOURS` o el tiempo que elija, y ver el historial de escaneos en un mapa. | nuevo |
| RF-E6 | El tag no contiene datos personales; solo la URL firmada. | nuevo (ADR-003) |
| RF-E7 | El QR impreso en el collar lleva el código público de la mascota y abre el mismo flujo con nivel `QR_SIN_VERIFICAR`. | nuevo (ADR-008) |

### F. Escaneo y hallazgo

| Id | Requisito | Origen |
|---|---|---|
| RF-F1 | Al acercar un teléfono al collar, el sistema operativo abre la URL: en la app si está instalada y el dominio está asociado; si no, en el navegador. | nuevo |
| RF-F2 | Una sola URL produce tres vistas según quién la abre: guardián con sesión, finder, o neutra cuando el tag no está activo. | nuevo |
| RF-F3 | La vista de finder muestra nombre y foto, «¿Encontraste a X?», y el botón para avisar. Funciona sin sesión y carga rápido en redes lentas. | nuevo (ADR-010) |
| RF-F4 | El aviso al dueño puede incluir ubicación aproximada con consentimiento, mensaje corto, una foto y teléfono opcional del finder. | nuevo |
| RF-F5 | Si la mascota está `PERDIDA`, el aviso llega con prioridad alta a todos los guardianes. Si está `EN_CASA`, llega con prioridad baja y con un botón para abrir el caso en un toque. | nuevo |
| RF-F6 | La vista de guardián muestra el perfil, el historial de escaneos, el interruptor de modo perdido y una vista previa de lo que ve un finder. | nuevo |
| RF-F7 | En iPhone 7, 8 y X y en Android con pantalla bloqueada, la app ofrece «Escanear collar» en primer plano; lee solo la URL. | nuevo |
| RF-F8 | El dueño puede marcar un escaneo como sospechoso; el tag pasa a `EN_REVISION` y deja de emitir avisos hasta que un administrador lo resuelva. | nuevo |
| RF-F9 | La ubicación del finder se muestra siempre como aproximada y nunca como punto de encuentro; la interfaz sugiere reunirse en lugar público. | nuevo |
| RF-F10 | El contacto entre finder y dueño se hace por relevo de la plataforma salvo que el dueño haya activado mostrar su teléfono. | nuevo |
| RF-F11 | Cuando el dueño activa mostrar su teléfono, la vista de finder ofrece botones de WhatsApp y de llamada en lugar del número en texto. | nuevo (S19) |

### G. Casos (publicaciones)

| Id | Requisito | Origen |
|---|---|---|
| RF-G1 | Feed con pestañas Recientes, Cerca de ti y Encontrados, filtro por especie y paginación por cursor. | web (paginación nueva) |
| RF-G2 | Detalle con galería, badge de estado, descripción, avistamientos no ocultos, mini mapa y compartir. | web |
| RF-G3 | Número oculto: el teléfono se enmascara y se revela solo con sesión. | web |
| RF-G4 | Crear, editar y eliminar publicación con las mismas reglas de campos, fotos, colonia y límite diario. Flujo 3d → 3c → 3e. | web |
| RF-G5 | Marcar encontrado con confirmación 5c, reversible; reactivar archivadas. | web |
| RF-G6 | Compartir con hoja nativa del sistema; el cartel imprimible se abre en la web. | web |
| RF-G7 | El caso creado desde modo perdido muestra que tiene collar con NFC. | nuevo |

### H. Avistamientos

| Id | Requisito | Origen |
|---|---|---|
| RF-H1 | «¡Lo he visto!» con pin arrastrable, zona aproximada, foto y nota opcionales; GPS solo sugiere; máximo uno por usuario, publicación y día; solo sobre casos activos. | web |
| RF-H2 | El dueño puede ocultar y volver a mostrar avistamientos. | web |

### I. Alertas y notificaciones

| Id | Requisito | Origen |
|---|---|---|
| RF-I1 | Tipos existentes: avistamiento, caso en colonia, recordatorio, aviso de archivo, buenas noticias. | web |
| RF-I2 | Tipos nuevos: aviso de hallazgo, escaneo de collar, transferencia de mascota. | nuevo |
| RF-I3 | Push nativo (FCM en Android, APNs en iOS) con registro de dispositivo por usuario; tocar la notificación abre la pantalla correspondiente. | nuevo (ADR-009) |
| RF-I4 | En Android, canales de notificación por tipo; en iOS, nivel de interrupción alto para hallazgos de mascota perdida. | nuevo |
| RF-I5 | Contador de no leídas y marcado de leídas al abrir la pantalla, como en la web. | web |
| RF-I6 | Interruptor «Nuevos casos en mi colonia». | web |
| RF-I7 | Los avisos de un mismo tag dentro de `SCAN_ALERT_GROUPING_WINDOW_MINUTES` se agrupan en una notificación. | nuevo |
| RF-I8 | Zona de alertas: en el onboarding la persona marca un punto aproximado (guardado redondeado a `ALERT_ZONE_DECIMALS`, nunca mostrado) y un radio de `ALERT_RADIUS_OPTIONS_KM`; los casos nuevos dentro del radio generan `CASO_CERCANO`, con un push por cubeta de distancia. El punto del mapa es obligatorio en publicaciones y avistamientos. | nuevo (S4) |

### J. Mapa

| Id | Requisito | Origen |
|---|---|---|
| RF-J1 | Marcadores por tipo: perdido, avistamiento, encontrado y, para guardianes, escaneos de su collar. | web + nuevo |
| RF-J2 | Consulta por área visible y agrupación en el servidor a partir de `MAP_CLUSTER_ZOOM_THRESHOLD`. | nuevo |
| RF-J3 | Rastro de avistamientos de un caso en orden temporal. | nuevo |
| RF-J4 | Filtros Todos, Perdidos, Avistamientos como en 5a, más Encontrados. | web |
| RF-J5 | Coordenadas acotadas al rango válido del proyecto (`COORDINATE_BOUNDS`). | web |

### K. Moderación y administración

| Id | Requisito | Origen |
|---|---|---|
| RF-K1 | Reportar publicación con motivos del catálogo, anónimo, máximo un pendiente por usuario y publicación. | web |
| RF-K2 | Toda acción administrativa lleva motivo y queda en bitácora. Se agregan acciones sobre tags, lotes y transferencias. | web + nuevo |
| RF-K3 | El panel administrativo sigue en la web de escritorio; la app no incluye administración. | web |
| RF-K4 | Cada descifrado de datos de contacto por un administrador queda en bitácora. | nuevo |

### L. Personalización de tags

| Id | Requisito | Origen |
|---|---|---|
| RF-L1 | Herramienta interna Android que lee el UID, pide al backend las llaves derivadas, cambia las cinco llaves, configura SUN, escribe la URL y verifica con el servidor. | nuevo (ADR-007) |
| RF-L2 | Solo administradores autenticados la usan; cada personalización queda en bitácora. | nuevo |
| RF-L3 | Un tag con verificación de originalidad fallida no se personaliza. | nuevo |

### M. Ciclo de vida y retención

| Id | Requisito | Origen |
|---|---|---|
| RF-M1 | Casos: recordatorio a los 14 días, aviso a los 83, archivado a los 90, con `activityAt` como ancla. | web |
| RF-M2 | Escaneos: purga a los `SCAN_LOG_RETENTION_MONTHS`. Tokens de escaneo, invitaciones y transferencias vencidas: purga periódica. | nuevo |
| RF-M3 | Dispositivos sin actividad en `DEVICE_STALE_DAYS` se eliminan del registro de push. | nuevo |

### N. Compatibilidad y despliegue

| Id | Requisito | Origen |
|---|---|---|
| RF-N1 | La app Android reemplaza al TWA con el mismo `applicationId` y un `versionCode` mayor. | nuevo |
| RF-N2 | El backend publica `assetlinks.json` con la huella de Play y el archivo de asociación de Apple con el identificador de la app. | web + nuevo |
| RF-N3 | La app consulta al arrancar una configuración remota con la versión mínima soportada y los proveedores OAuth habilitados. | nuevo |
| RF-N4 | Enlaces que abren la app: tag, QR, hallazgo, publicación e invitaciones. | nuevo |

### O. Cobertura nacional (S18)

| Id | Requisito | Origen |
|---|---|---|
| RF-O1 | Todos los municipios del catálogo SEPOMEX están activos; `municipio.active` es un interruptor de apagado por municipio con motivo y bitácora. | nuevo |
| RF-O2 | Cada municipio tiene un centroide (INEGI) para centrar el mapa y el pin de captura cuando la persona no tiene zona de alertas. | nuevo |
| RF-O3 | La validación de coordenadas cubre todo México; no hay centro de ciudad fijo en el código. | nuevo |
| RF-O4 | El feed «Recientes» se acota al municipio de la persona (o al elegido por el visitante); «Cerca de ti» usa el radio de la zona de alertas. | cambio |
| RF-O5 | La marca, el aviso de privacidad y la ficha de la tienda hablan de México, no de una región. | cambio |

## 3. Requisitos no funcionales

| Id | Requisito |
|---|---|
| RNF-1 | La vista de finder pesa poco y es utilizable en redes 3G: sin dependencias de terceros bloqueantes ni fuentes externas obligatorias. |
| RNF-2 | La app tolera pérdida de red: muestra lo último cargado, encola el registro de dispositivo y reintenta con retroceso exponencial. No promete funcionar sin conexión. |
| RNF-3 | Fotos comprimidas en el dispositivo antes de subir, con los mismos límites que el navegador (`CLIENT_IMAGE_MAX_DIMENSION`, `CLIENT_IMAGE_QUALITY`). |
| RNF-4 | Accesibilidad: etiquetas en todos los controles, tamaño de texto dinámico, contraste de los tokens de marca, respeto a «reducir movimiento». |
| RNF-5 | Idioma `es-MX`. Ningún texto de interfaz vive en componentes; cada feature tiene su módulo de textos. |
| RNF-6 | Observabilidad: errores de la app y del backend con identificador de correlación; sin datos personales en logs. |
| RNF-7 | Pruebas: unitarias en dominio y repositorios; contrato generado verificado en CI; pruebas de flujo en Android con Maestro; el verificador SUN con vectores oficiales. |
| RNF-8 | Cero valores mágicos, cero secretos en código, configuración validada al arrancar en backend y app. |
| RNF-9 | Patrones de diseño aplicados donde reducen acoplamiento (documento 02 §3.4), sin capas vacías. |
| RNF-10 | El backend sigue siendo un monolito modular por features; ningún servicio nuevo separado. |

## 4. Requisitos de seguridad

| Id | Requisito |
|---|---|
| SEG-1 | Verificación SUN completa en el servidor: descifrado, llave por tag, CMAC en tiempo constante, contador estrictamente creciente. |
| SEG-2 | Toda acción de hallazgo exige un token de escaneo vigente y no consumido. Sin token, las rutas responden con la pantalla neutra. |
| SEG-3 | Ningún tag sale con llaves de fábrica; el estado `LISTO` solo se alcanza tras cambiar las cinco llaves. |
| SEG-4 | Las llaves maestras viven en el gestor de secretos; nunca en logs, respuestas ni repositorios. |
| SEG-5 | Datos de contacto cifrados en reposo con cifrado de sobre; búsqueda por HMAC; bitácora de descifrados administrativos. |
| SEG-6 | Límites anti-abuso: cooldown por tag y dispositivo, agrupación, silencio, límite diario en el camino sin verificar, congelación por sospecha. |
| SEG-7 | El perfil público nunca expone dirección, nombre completo del dueño ni teléfono sin opt-in. |
| SEG-8 | Respuestas idénticas para tag desconocido, firma inválida y replay hacia el exterior; el detalle solo va a la bitácora. |
| SEG-9 | Sesiones móviles con token portador en almacenamiento seguro; revocación desde el backend. |
| SEG-10 | Rate limit por IP y dispositivo en `/t`, `/q` y endpoints de hallazgo, además del existente en autenticación. |

## 5. Parámetros de producto

Los valores marcados `nuevo` son propuesta inicial y se ajustan cambiando la constante,
nunca tocando la lógica. Los marcados `web` ya existen con ese nombre en el proyecto web
y la app los recibe por el contrato o por configuración remota, sin duplicarlos a mano.

| Constante | Valor | Origen | Dónde vive |
|---|---|---|---|
| `MAX_PHOTOS` / `MIN_PHOTOS` | 4 / 1 | web | `features/publications/schemas.ts` |
| `MAX_PHOTO_BYTES` | 8 MiB | web | ídem |
| `NAME_MAX_LENGTH` | 40 | web | ídem |
| `DESCRIPTION_MIN_LENGTH` / `DESCRIPTION_MAX_LENGTH` | 10 / 400 | web | ídem |
| `REFERENCE_MIN_LENGTH` / `REFERENCE_MAX_LENGTH` | 5 / 120 | web | ídem |
| `SPECIES_DETAIL_MAX_LENGTH` | 40 | web | ídem |
| `PHONE_LENGTH` | 10 | web | ídem |
| `MAX_PUBLICATIONS_PER_DAY` | 3 | web | `features/publications/constants.ts` (movida desde `service.ts` en S1) |
| `ZONE_MIN_LENGTH` / `ZONE_MAX_LENGTH` / `NOTE_MAX_LENGTH` | 3 / 80 / 200 | web | `features/sightings/schemas.ts` |
| Avistamientos por usuario, publicación y día | 1 | web | `features/sightings/service.ts` |
| `REPORT_NOTE_MAX_LENGTH` | 300 | web | `features/reports/schemas.ts` |
| `MIN_REASON_LENGTH` / `MAX_REASON_LENGTH` | 5 / 300 | web | `features/admin/schemas.ts` |
| `REMINDER_DAYS` / `ARCHIVE_WARNING_DAYS` / `ARCHIVE_DAYS` | 14 / 83 / 90 | web | `features/lifecycle/service.ts` |
| `FEED_PAGE_SIZE` | 30 | web | `features/feed/queries.ts` |
| `ALERTS_PAGE_SIZE` | 30 | web | `features/alerts/queries.ts` |
| `PHOTO_MAX_DIMENSION` / `WEBP_QUALITY` | 1280 / 78 | web | `lib/photo-storage.ts` |
| `CLIENT_IMAGE_MAX_DIMENSION` / `CLIENT_IMAGE_QUALITY` | 1600 / 0.85 | web (`MAX_DIMENSION`, `JPEG_QUALITY`) | `lib/image-compress.ts`; la app replica el valor por contrato |
| Rate limit de autenticación | 60 peticiones / 60 s | web | `lib/auth.ts` |
| `COORDINATE_BOUNDS`, `CITY_CENTER`, `CITY_ZOOM`, `CASE_ZOOM` | ver `features/map/constants.ts` | web | ídem |
| `DELETE_CONFIRM_WORD` | `ELIMINAR` | web | `features/account/schemas.ts` |
| `LIFECYCLE_EVERY_MS` | 6 h | web | `instrumentation.ts` |
| `SCAN_TOKEN_TTL_MINUTES` | 15 | nuevo | `features/scans/constants.ts` |
| `SCAN_ALERT_COOLDOWN_MINUTES` | 10 | nuevo | ídem |
| `SCAN_ALERT_GROUPING_WINDOW_MINUTES` | 5 | nuevo | ídem |
| `UNVERIFIED_ALERT_COOLDOWN_MINUTES` | 60 | nuevo | ídem |
| `UNVERIFIED_ALERTS_PER_TAG_PER_DAY` | 3 | nuevo | ídem |
| `ALERT_RADIUS_OPTIONS_KM` | 1, 3, 5, 10 | nuevo | `features/alerts/constants.ts` |
| `DEFAULT_ALERT_RADIUS_KM` | 3 | nuevo | ídem |
| `ALERT_ZONE_DECIMALS` | 3 (unos 110 m) | nuevo | ídem |
| `REPLAY_SUSPICION_THRESHOLD` | 3 intentos | nuevo | ídem |
| `APPROX_LOCATION_DECIMALS` | 3 (unos 110 m) | nuevo | ídem |
| `FINDER_MESSAGE_MAX_LENGTH` | 300 | nuevo | ídem |
| `SCAN_LOG_RETENTION_MONTHS` | 12 | nuevo | ídem |
| `TAG_MUTE_DEFAULT_HOURS` | 4 | nuevo | `features/tags/constants.ts` |
| `NFC_KEY_VERSION_FACTORY` | 0 | nuevo | ídem |
| `PET_PUBLIC_CODE_LENGTH` | 10 caracteres base32 | nuevo | `features/pets/constants.ts` |
| `MAX_PETS_PER_USER` | 10 | nuevo | ídem |
| `MAX_GUARDIANS_PER_PET` | 5 | nuevo | ídem |
| `MEDICAL_NOTES_MAX_LENGTH` | 300 | nuevo | ídem |
| `MICROCHIP_CODE_MAX_LENGTH` | 15 (ISO 11784) | nuevo | ídem |
| `EXPIRED_LINKS_RETENTION_DAYS` | 30 | nuevo | `features/guardians/constants.ts` |
| `LINK_CODE_BYTES` | 32 bytes de entropía | nuevo | ídem |
| `SCAN_TOKEN_BYTES` | 32 bytes de entropía | nuevo | `features/scans/constants.ts` |
| `GUARDIAN_INVITE_TTL_HOURS` | 72 | nuevo | `features/guardians/constants.ts` |
| `PET_TRANSFER_TTL_DAYS` | 7 | nuevo | ídem |
| `MAP_CLUSTER_ZOOM_THRESHOLD` | 14 | nuevo | `features/map/constants.ts` |
| `MAP_MAX_PINS_PER_REQUEST` | 500 | nuevo | ídem |
| `DEVICE_STALE_DAYS` | 180 | nuevo | `features/devices/constants.ts` |
| `MIN_SUPPORTED_APP_VERSION` | por entorno | nuevo | configuración remota `/api/v1/config` |
| `API_RATE_LIMIT_STANDARD_PER_MINUTE` | 120 por IP | nuevo | `lib/api/constants.ts` |
| `API_RATE_LIMIT_SCAN_PER_MINUTE` | 20 por IP | nuevo | `lib/api/constants.ts` |

## 6. Fuera de alcance de la primera entrega

| Tema | Motivo | Cuándo |
|---|---|---|
| App Clip de iOS | Requiere entorno macOS | Fase posterior, ADR-010 |
| Chat efímero finder y dueño | Depende de infraestructura de mensajería en tiempo real | Fase posterior; el modelo de datos lo prevé |
| SMS de respaldo | Costo por mensaje; opción de pago | Fase posterior |
| Widgets y Live Activities | Código nativo específico | Fase posterior |
| Rotación ponderada del feed | No existe en la web; se resuelve en la web primero | Backlog web |
| Administración desde el móvil | Se mantiene en escritorio | Sin fecha |
