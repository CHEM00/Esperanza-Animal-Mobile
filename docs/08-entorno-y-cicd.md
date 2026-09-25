# 08 · Entorno de desarrollo, cuentas y CI/CD

## 1. Máquinas y herramientas

| Elemento | Situación actual | Requisito |
|---|---|---|
| Equipo de desarrollo | Windows 11 Pro, Node 24, Git 2.51 | Suficiente para backend, web y Android |
| PostgreSQL | 16 (Docker en local, Coolify en producción) | Extensión `unaccent` (contrib) disponible: la migración `unaccent_extension` de S18 la crea como extensión de confianza; si el proveedor no lo permite, crearla una vez a mano como superusuario |
| JDK | Por instalar | JDK 17 LTS, exigido por el plugin de Android Gradle |
| Android Studio | Por instalar | Versión estable; incluye SDK, emulador y herramientas de plataforma |
| Emulador Android | — | Requiere Hyper-V o Windows Hypervisor Platform activados en Windows 11 Pro |
| Expo y EAS CLI | Por instalar | Expo como dependencia del proyecto; EAS CLI global |
| Xcode | No disponible (no hay Mac) | Las builds de iOS se hacen en la nube con EAS Build |
| Lector NFC de escritorio | ACR122U (existe) | Driver de ACS instalado; en Windows, desactivar el driver genérico que el sistema asigna al lector. Personalización de tags (ADR-012) |

**Qué se puede hacer sin Mac:** compilar y firmar iOS en EAS, instalar builds de desarrollo
en el iPhone por enlace, subir a TestFlight y App Store con EAS Submit.
**Qué no se puede:** depurar código Swift, construir el App Clip, usar simuladores de iOS.
Esas tareas están en la fase con entorno macOS (Mac mini, o Mac en la nube rentada por días).

## 2. Dispositivos de prueba

| Dispositivo | Uso | Condición |
|---|---|---|
| iPhone físico (disponible) | Lectura NFC en segundo plano, enlaces universales, push | Modelo XS o posterior para lectura en segundo plano |
| Android de gama media o baja | Rendimiento real del público objetivo, NFC, App Links | Con NFC. Un segundo equipo **sin** NFC valida el camino QR |
| Tags NTAG 424 DNA (comprados) | Lectura, montaje y rango | Verificados con NXP TagInfo |

## 3. Cuentas y servicios

| Cuenta | Estado | Para qué |
|---|---|---|
| Google Play Console | Existe (TWA en prueba cerrada; producción denegada en septiembre de 2026 por uso insuficiente, ver S16) | Publicar la app nativa con el mismo `applicationId` y `versionCode` mayor |
| Apple Developer Program | Pendiente | Push APNs, Sign in with Apple, TestFlight, App Store, enlaces universales |
| Proyecto Firebase | Pendiente | FCM para Android |
| Llave APNs (.p8) | Pendiente, depende de Apple Developer | Push en iOS |
| Expo / EAS | Pendiente | Builds en la nube, submit |
| Google Cloud (OAuth) | Existe para web | Clientes OAuth de tipo Android e iOS para login nativo con ID token |
| Microsoft Entra | Existe para web | Registrar plataforma móvil si se ofrece Microsoft en la app |
| Gestor de secretos del despliegue (Coolify) | Existe | Llaves maestras NFC, llave maestra de cifrado, credenciales de push |

## 4. Firma y distribución

- **Android.** Play App Signing administra la llave de firma; la llave de subida actual
  se conserva en `../Esperanza Animal/LLAVE-DE-SUBIDA-Play*`. La app nativa se sube como
  release del mismo paquete; el `assetlinks.json` de la web sigue válido porque la huella
  de firma de Play no cambia. `TWA_PACKAGE_NAME` y `TWA_CERT_SHA256` pasan a llamarse por
  su función real (`ANDROID_PACKAGE_NAME`, `ANDROID_CERT_SHA256`) con alias temporal.
- **iOS.** Certificados y perfiles administrados por EAS.
- **Secretos de build** (llave de mapas, identificadores OAuth) como secretos de EAS;
  valores públicos por `EXPO_PUBLIC_*`; nunca en el código.

## 5. CI/CD

| Etapa | Herramienta | Disparador |
|---|---|---|
| Lint, typecheck, pruebas unitarias | GitHub Actions (Linux) | Cada pull request |
| Cliente generado y tokens al día | `npm run api:check`, `npm run tokens:check` | Cada pull request |
| Build de desarrollo | EAS Build, perfil `development` | Manual |
| Build interna (QA) | EAS Build, perfil `preview` | Push a rama de release |
| Build de tienda | EAS Build, perfil `production` | Tag de versión |
| Publicación | EAS Submit a Play y TestFlight | Manual tras QA |
| Flujos en Android | Maestro sobre la build `preview` | Rama de release |

Backend: el pipeline existente del repo web (Dockerfile, Coolify) no cambia; se agregan
las pruebas del verificador SUN, de los handlers de `/api/v1` y `contract:check`.

## 6. Variables de entorno nuevas en el backend

Todas se validan al arrancar en `env-schema.ts`; si falta una obligatoria, el contenedor
no levanta. Las opcionales apagan la función, como hoy con VAPID.

| Variable | Tipo | Uso |
|---|---|---|
| `NFC_META_READ_KEY_V1` | 32 hex | Llave SDMMetaRead común (doc 04 §3). Las tres llaves de la versión van juntas |
| `NFC_FILE_READ_MASTER_KEY_V1` | 32 hex | Maestra para derivar SDMFileRead por tag |
| `NFC_APP_MASTER_KEY_V1` | 32 hex | Maestra para derivar la Key 0 y las llaves 3 y 4 |
| `NFC_SYSTEM_IDENTIFIER` | texto, hasta 23 caracteres | Componente fijo de la diversificación; obligatoria con las llaves. La versión vigente es la más alta configurada, no hay variable aparte |
| `NFC_ALLOW_FACTORY_KEYS` | booleano, prohibida en producción | Acepta chips con llaves de fábrica (versión 0) para la primera prueba (doc 10) |
| `NFC_SCAN_DIAGNOSTICS` | booleano, prohibida en producción | Página de diagnóstico de `/t` (doc 10) |
| `DATA_ENCRYPTION_MASTER_KEY_V1` | 64 hex | Llave maestra del cifrado de sobre (ADR-004) |
| `DATA_ENCRYPTION_KEY_VERSION_CURRENT` | entero | Versión para registros nuevos |
| `FCM_SERVICE_ACCOUNT_JSON` | JSON | Remitente FCM (Android) |
| `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_KEY_P8`, `APNS_TOPIC` | texto | Remitente APNs (iOS); `APNS_TOPIC` es el bundle id |
| `ANDROID_PACKAGE_NAME`, `ANDROID_CERT_SHA256` | texto | App Links (renombre de `TWA_*`) |
| `IOS_BUNDLE_ID`, `APPLE_TEAM_ID` | texto | Archivo de asociación de Apple |
| `GOOGLE_MOBILE_CLIENT_IDS` | lista separada por coma | Audiencias válidas del ID token de Google |
| `MOBILE_APP_SCHEME` | texto | Esquema de retorno OAuth registrado en `trustedOrigins` |
| `MIN_SUPPORTED_APP_VERSION` | semver | Configuración remota |

Los hashes de IP y de identificador de dispositivo en la bitácora de escaneos usan una
llave derivada de `BETTER_AUTH_SECRET` con HKDF y un propósito fijo; no necesitan
variable propia. Las llaves de fábrica (todo ceros) se usan **solo** en local para la
primera lectura de chips (documento 10), con `NFC_ALLOW_FACTORY_KEYS=true`.

## 7. Variables de la app móvil

| Variable | Perfil | Uso |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | por perfil EAS | Dominio del backend |
| `EXPO_PUBLIC_LINK_DOMAIN` | por perfil | Dominio de enlaces universales |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID`, `..._IOS` | por perfil | Login nativo |
| `EXPO_PUBLIC_MAPS_PROVIDER` | por perfil | `native` o `maplibre` |
| Llave de Google Maps para Android | secreto EAS | Inyectada en el manifiesto por config plugin |
| `WEB_REPO_PATH` | solo local | Ruta al repo web para `sync-tokens` |
