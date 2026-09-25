# 06 · App móvil (React Native + Expo)

## 1. Stack

| Capa | Elección | Motivo |
|---|---|---|
| Base | React Native con Expo, TypeScript estricto | ADR-001; builds y distribución sin Mac |
| Navegación | Expo Router con pila nativa y pestañas nativas | Rutas por archivo, enlaces profundos integrados, transiciones del sistema |
| Datos remotos | TanStack Query sobre el cliente generado del contrato | Caché, reintentos, invalidación, estados de carga uniformes |
| Estado local | Zustand para estado de sesión y preferencias; estado de formulario con react-hook-form | Sin sobre-ingeniería; nada global que no lo necesite |
| Validación | Zod, con los mismos límites que publica `GET /api/v1/config` | Feedback inmediato sin duplicar reglas a mano |
| Almacenamiento seguro | expo-secure-store | Token de sesión |
| Push | expo-notifications | Token nativo de cada plataforma, permisos, canales, manejo de toques |
| NFC | react-native-nfc-manager detrás del puerto `NfcReader` | Lectura NDEF en primer plano |
| Mapas | react-native-maps detrás del puerto `MapProvider` | MapKit en iOS, Google Maps en Android; sustituible por MapLibre |
| Imágenes | expo-image, expo-image-picker, expo-image-manipulator | Caché de fotos, cámara y galería, compresión previa |
| Ubicación | expo-location | Sugerir pin; ubicación aproximada del finder |
| Compartir | API de compartir de React Native | Hoja nativa |
| Pruebas | Jest con jest-expo, React Native Testing Library, Maestro | Unitarias, de componentes y de flujo |

Las versiones se fijan al crear el proyecto (sección S10) con la SDK estable de Expo del
momento y quedan en `package.json`; este documento no las repite.

Notas de S10 (2026-09-13, Expo SDK 57):

- Las pestañas nativas se importan de `expo-router/unstable-native-tabs`, la única
  entrada que expone el SDK. Están detrás de un solo archivo (`app/(tabs)/_layout.tsx`)
  para cambiar a las pestañas clásicas si la API se rompe.
- TypeScript queda en la rama 5.9 porque `openapi-typescript` aún no admite la 6.
- `react-dom` se fija a la versión de `react` con `overrides`: Better Auth y Expo lo
  declaran como par opcional y npm intentaba instalar una versión incompatible.
- La configuración de build vive en `config/build-config.js` (JavaScript con JSDoc):
  el cargador de configuración de Expo no resuelve módulos TypeScript locales.
- Microsoft por navegador del sistema exige el plugin Expo de Better Auth también en
  el servidor; queda para cuando el backend lo incorpore (nueva dependencia con
  regeneración del lockfile en Linux).

## 2. Estructura de carpetas

```
app/                          Rutas de Expo Router (solo composición de pantallas)
  (auth)/login, onboarding
  (tabs)/inicio, mapa, alertas, perfil
  publicacion/[id], publicar/index, publicar/[id]
  mascotas/index, mascotas/nueva, mascotas/[id]/(perfil|editar|collar|escaneos|guardianes)
  collar/activar, collar/escanear
  encontre/[token]
  invitacion/[code], transferencia/[code]
  ajustes, actualizar
src/
  core/
    config/        Configuración tipada y validada al arrancar
    api/           Cliente generado, envoltura HTTP, correlación, manejo de Problem Details
    auth/          Sesión, inicio de sesión nativo, almacenamiento seguro
    theme/         Tokens generados desde la web, tipografías, hook de tema
    navigation/    Mapa de enlaces profundos y helpers de rutas (única fuente de rutas)
    ports/         Interfaces de dispositivo: NfcReader, PushRegistrar, LocationProvider,
                   ImagePicker, ShareSheet, MapProvider
    adapters/      Implementaciones de los puertos sobre librerías concretas
    i18n/          Formato de fechas y números en es-MX
    errors/        Tipos de error de dominio y mapeo de códigos a textos
  features/
    <feature>/
      screens/     Pantallas (composición)
      components/  Piezas de UI de la feature
      hooks/       Casos de uso expuestos a la UI
      repository/  Acceso a datos sobre el cliente generado y claves de caché
      model/       Tipos derivados del contrato y esquemas de formulario
      strings.ts   Textos de la feature
  shared/
    ui/            Primitivas compartidas (botón, tarjeta, hoja, lista, estados vacíos)
    utils/
```

Reglas: `app/` no contiene lógica; una pantalla vive en `features/*/screens` y la ruta la
importa. Ningún componente importa el cliente generado; pasa por un repositorio. Ningún
texto de interfaz vive fuera de `strings.ts`.

## 3. Capas y patrones

| Patrón | Dónde | Por qué |
|---|---|---|
| Repositorio | `features/*/repository` | La UI pide «mis mascotas», no «GET /pets»; cambia el transporte sin tocar pantallas |
| Puertos y adaptadores | `core/ports` y `core/adapters` | NFC, push, ubicación, mapas e imágenes son librerías de terceros sustituibles; las pruebas usan dobles |
| Estrategia | Render de la vista de escaneo (`GUARDIAN`, `FINDER`, `ACTIVATION`, `NEUTRAL`) | La API decide la vista; la app elige el renderizador por clave, sin condicionales anidados |
| Máquina de estados explícita | Activar collar; publicar (3d → 3c → 3e); modo perdido; onboarding | Flujos multipaso con estados nombrados y transiciones válidas; un reductor por flujo |
| Fábrica | Cliente API desde la configuración; cola de consultas | Construcción única y comprobable |
| Observador | Invalidación de consultas al recibir push o al volver al primer plano | Datos frescos sin recargas manuales |
| Fachada | `core/auth` expone `signIn`, `signOut`, `session` | Oculta Better Auth y el almacenamiento seguro |

## 4. Mapa de pantallas

Códigos existentes del diseño web cuando aplica; códigos `M` para pantallas nuevas.

| Código | Pantalla | Ruta | Notas |
|---|---|---|---|
| 3a | Splash | `/` | Solo primera apertura; después va directo a Inicio |
| 3b | Login | `/login` | Botones nativos de Google y Apple; Microsoft por navegador del sistema |
| 6b | Onboarding | `/onboarding` | Colonia por CP, especies, privacidad |
| 2a, 4c, 4e | Feed | `/inicio` | Pestañas nativas con paginación infinita |
| 4a, 6g | Detalle de caso | `/publicacion/[id]` | Galería, contacto, avistamientos, mini mapa, compartir |
| 3f | Avistamiento | hoja sobre el detalle | Pin arrastrable, zona, foto, nota |
| 5a | Mapa | `/mapa` | Filtros, clústeres, tarjeta inferior |
| 3c, 3d, 3e, 6c, 6h | Publicar y editar | `/publicar`, `/publicar/[id]` | Máquina de estados del flujo |
| 4d | Alertas | `/alertas` | Lista paginada; toque abre destino |
| 3g | Perfil | `/perfil` | Stats, mis casos, ayudaste, acceso a Mis mascotas |
| 6a | Reportar | hoja | Motivos del catálogo |
| 6e | Privacidad | web | Se abre en navegador interno |
| M1 | Mis mascotas | `/mascotas` | Lista con estado y collar |
| M2 | Perfil de mascota | `/mascotas/[id]` | Fotos, datos, estado, acciones |
| M3 | Crear y editar mascota | `/mascotas/nueva`, `/mascotas/[id]/editar` | Fotos, campos, preferencias de visibilidad |
| M4 | Activar collar | `/collar/activar` | Guía de acercamiento y elección de mascota |
| M5 | Escanear collar | `/collar/escanear` | Lectura en primer plano; respaldo |
| M6 | Vista de finder en la app | `/encontre/[token]` | Idéntica en contenido a la web |
| M7 | Historial de escaneos | `/mascotas/[id]/escaneos` | Lista y mapa; marcar sospechoso |
| M8 | Guardianes | `/mascotas/[id]/guardianes` | Lista, invitar, quitar |
| M9 | Aceptar invitación o transferencia | `/invitacion/[code]`, `/transferencia/[code]` | Enlace profundo |
| M10 | Modo perdido | hoja sobre M2 | Reutiliza avisos 3d y 3e; crea el caso |
| M11 | Actualización obligatoria | `/actualizar` | Cuando la versión es menor a la mínima |
| M12 | Contacto del dueño | `/ajustes/contacto` | Teléfonos y contacto de emergencia |

Navegación principal: pestañas Inicio, Mapa, Alertas y Perfil con el botón central de
publicar, como en la web. «Mis mascotas» entra desde Perfil y desde el detalle de un caso
propio: la mayoría de usuarios son comunidad sin collar, y la barra no debe reflejar solo
al segmento que lo compra.

## 5. Enlaces profundos

| URL | Pantalla | Plataforma |
|---|---|---|
| `https://<dominio>/t?p&m` | Resolución de escaneo | Enlace universal y App Link |
| `https://<dominio>/q/{code}` | Resolución de escaneo QR | ídem |
| `https://<dominio>/encontre/{token}` | M6 | ídem |
| `https://<dominio>/publicacion/{id}` | 4a | ídem |
| `https://<dominio>/invitacion/{code}`, `/transferencia/{code}` | M9 | ídem |
| `esperanzaanimal://auth/callback` | Retorno de OAuth por navegador | Esquema propio, solo autenticación |

El mapa de rutas vive en `core/navigation/links.ts` y es la única fuente; la web publica
los archivos de asociación con las mismas rutas (`lib/deep-links.ts` del backend, S9). El
dominio viene de configuración. Excepción: `/publicacion/{id}/cartel` se imprime en el
navegador; el archivo de Apple lo excluye y en Android la app debe abrirlo en el navegador
porque los App Links no admiten exclusiones. Si la app no está instalada, los enlaces de
invitación y transferencia abren páginas web de respaldo que aceptan con sesión.

## 6. Autenticación

1. Al arrancar, la app carga la configuración remota y la sesión almacenada.
2. Google: selector de cuentas nativo; el ID token va a Better Auth; el encabezado de
   respuesta entrega el token de sesión, que se guarda en almacenamiento seguro.
3. Apple: Sign in with Apple nativo; mismo camino con `identityToken`.
4. Microsoft: navegador del sistema con retorno por esquema propio, gestionado por el
   plugin Expo de Better Auth.
5. Toda petición lleva `Authorization: Bearer`. Un `401` limpia la sesión y vuelve a 3b.
6. Onboarding incompleto redirige a 6b antes de cualquier pantalla con sesión.

## 7. Notificaciones push

| Paso | Detalle |
|---|---|
| Permiso | Se pide en contexto: al activar alertas de colonia, al activar un collar o al publicar; nunca al arrancar |
| Registro | `PUT /api/v1/devices` con el token nativo de la plataforma, versión de app y sistema; se repite al cambiar el token y al iniciar sesión |
| Baja | `DELETE /api/v1/devices/{token}` al cerrar sesión |
| Toque | El payload lleva la URL de destino; el mapa de enlaces la resuelve |
| Primer plano | Se muestra un aviso in-app y se invalidan las consultas afectadas |

Canales de Android y prioridades:

| Canal | Tipos de alerta | Prioridad |
|---|---|---|
| `hallazgos` | `AVISO_HALLAZGO` con mascota `PERDIDA` | Alta, sonido, vibración |
| `collar` | `ESCANEO_COLLAR`, `AVISO_HALLAZGO` con mascota `EN_CASA` | Por defecto |
| `casos` | `AVISTAMIENTO`, `CASO_COLONIA`, `BUENAS_NOTICIAS` | Por defecto |
| `recordatorios` | `RECORDATORIO`, `AVISO_ARCHIVO` | Baja |
| `mascotas` | `TRANSFERENCIA_MASCOTA` | Por defecto |

En iOS, los hallazgos de mascota perdida usan el nivel de interrupción alto disponible sin
permisos especiales.

## 8. NFC en primer plano

- Solo lectura NDEF; la app nunca autentica con el chip ni conoce llaves (ADR-003).
- iOS muestra la hoja del sistema con un texto propio («Acerca la parte superior del
  iPhone al collar»). Android usa modo lector con la pantalla encendida.
- La URL leída se entrega al mismo resolvedor que los enlaces profundos. Si no es una URL
  del dominio configurado, se muestra «Este no es un collar de Esperanza Animal».
- El puerto `NfcReader` expone `isAvailable()`, `readUrl()` y `cancel()`; en dispositivos
  sin NFC la pantalla M5 ofrece escanear el QR con la cámara.

## 9. Mapas

- Puerto `MapProvider` con una implementación sobre react-native-maps. Una segunda sobre
  MapLibre se agrega solo si el costo o la consistencia con la web lo justifican.
- Los pines vienen de `GET /api/v1/map/pins` por área visible; la app no descarga todo.
- Tipos de marcador con color de token: perdido (`alert`), avistamiento (`primary`),
  encontrado (`success`), escaneo (`warn`). Clústeres con contador.
- El rastro de un caso se dibuja con `GET /api/v1/publications/{id}/trail`.
- Pin arrastrable y zona aproximada en 3f y 3c reutilizan el mismo componente.
- Coordenadas acotadas con `COORDINATE_BOUNDS` que llega por configuración remota.

## 10. Diseño y tema

**Marca compartida, chrome nativo.** Los tokens de color, tipografía y radios son los de
la web; los componentes son los del sistema.

- Un script `scripts/sync-tokens.mjs` lee `src/styles/tokens.css` y `src/app/globals.css`
  del repo web (ruta por variable de entorno `WEB_REPO_PATH`) y genera
  `src/core/theme/tokens.generated.ts` con ambos temas y los radios. CI verifica que el
  archivo generado esté al día. Ningún color se escribe a mano en la app.
- Tema claro con Quicksand; tema oscuro con Space Grotesk e Inter, como en la web.
  Fuentes empaquetadas con expo-font. El modo sigue al sistema con override manual, como
  `next-themes`.
- Componentes nativos primero: pila con título grande en iOS y barra Material en
  Android; hojas inferiores nativas; menús contextuales de iOS; ripple en Android;
  selectores de fecha del sistema. La barra de pestañas usa el componente nativo de cada
  plataforma; el efecto «liquid glass» de la web se logra con la barra nativa de iOS y se
  aproxima con elevación en Android, no se reimplementa a mano.
- Iconos de marca (huella, caritas) como SVG con react-native-svg, copiados de la web.
- La marca de agua ENCONTRADO, los badges y los estados vacíos reproducen la web con
  tokens.

## 11. Estado, caché y red

- Cada consulta define `staleTime` por tipo: feed y alertas cortos; detalle y perfil de
  mascota medios; configuración remota larga con revalidación al volver al primer plano.
- Reintentos con retroceso exponencial solo en errores de red y `5xx`; nunca en `4xx`.
- Sin conexión: se muestra el último dato en caché con un aviso; las acciones se rechazan
  con mensaje claro salvo el registro de dispositivo, que se encola.
- Fotos con caché en disco de expo-image y la URL inmutable de `/fotos/{id}`.

## 12. Configuración

- `app.config.ts` tipado; los valores públicos entran por `EXPO_PUBLIC_*`; los secretos
  de build por EAS. Un módulo `core/config` valida con Zod al arrancar y la app no
  continúa si falta algo, igual que `env.ts` en el backend.
- Perfiles EAS: `development`, `preview`, `production`, cada uno con su dominio de API.
- Identificadores: `applicationId` de Android igual al del TWA; `bundleIdentifier` de iOS
  nuevo; ambos en configuración, no en código.

## 13. Calidad

| Tema | Regla |
|---|---|
| Lint y tipos | ESLint con reglas de React Native y de imports por capas (una pantalla no importa adaptadores); `tsc --noEmit` en CI |
| Unitarias | Repositorios, reductores de flujo, mapeo de errores, utilidades de formato |
| Componentes | React Native Testing Library para pantallas con lógica de estado |
| Flujo | Maestro en Android para: login, publicar, avistar, activar collar (con URL simulada), modo perdido |
| Contrato | `npm run api:check` en CI |
| Tokens | `npm run tokens:check` en CI |
| Commits | Convencionales en español, como el repo web (`feat(mascotas): ...`) |

## 14. Accesibilidad e idioma

- Etiqueta accesible en todo control; orden de foco lógico; tamaño de texto dinámico
  soportado con la escala del sistema; contraste de los tokens verificado.
- «Reducir movimiento» desactiva las animaciones del splash y de las hojas.
- `es-MX` en textos, fechas y números; el formato relativo replica `relative-time.ts`.

## 15. Fase posterior (requiere entorno macOS)

- App Clip en Swift para la vista de finder desde el tag.
- Live Activity para una búsqueda activa.
- Widget de Android con Glance y widget de iOS.
