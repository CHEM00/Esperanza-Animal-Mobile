# 07 · Herramienta interna de personalización de tags

Aplicación Android de uso exclusivo de sysosa para dejar cada chip en estado `LISTO`.
Vive en un repositorio interno separado (ADR-005, ADR-007). No se publica en tiendas; se
distribuye como APK firmado a los dispositivos del operador.

## 1. Alcance

Hace: verificar originalidad, cambiar las cinco llaves, configurar SUN, escribir la URL,
comprobar una lectura con el servidor y registrar el resultado. No hace: asignar mascotas,
ver datos de usuarios ni consultar escaneos. Todo eso vive en la web de administración.

## 2. Stack

| Capa | Elección | Motivo |
|---|---|---|
| Lenguaje y UI | Kotlin, Jetpack Compose | Estándar de Android |
| NFC | TapLinx (SDK oficial de NXP para NTAG 424 DNA) | Implementa autenticación EV2, cambio de llaves y configuración SDM; requiere registro en el portal de NXP y clave de licencia por paquete |
| Red | Cliente HTTP con serialización JSON y el contrato OpenAPI del backend | Mismos tipos que la API |
| Sesión | Inicio de sesión con la cuenta de administrador por navegador del sistema; token portador en almacenamiento cifrado | Reutiliza Better Auth y el rol `admin` |
| Arquitectura | Flujo de datos unidireccional, ViewModel por pantalla, capa de datos con repositorio | Referencia oficial de Android |

## 3. Flujo de personalización

```mermaid
sequenceDiagram
  participant O as Operador
  participant H as Herramienta
  participant C as Chip
  participant B as Backend
  O->>H: acerca el chip
  H->>C: leer UID y firma de originalidad
  H->>H: verificar firma NXP; si falla, detener
  H->>B: POST /internal/tags/{uid}/keys
  B-->>H: llaves derivadas, keyVersion, URL plantilla
  H->>C: autenticar con llave de fábrica (Key 0)
  H->>C: cambiar Key 0..4
  H->>C: configurar SDM (PICCData cifrado, CMAC, offsets)
  H->>C: escribir NDEF URL plantilla
  H->>C: lectura de prueba
  H->>B: POST /internal/tags/{uid}/provisioned {p, m}
  B->>B: verificar SUN; marcar LISTO; bitácora
  B-->>H: OK
  H-->>O: chip LISTO
```

Reglas:

- Las llaves derivadas viven solo en memoria durante la operación y se borran al
  terminar o al fallar. Nunca se escriben en disco ni en logs.
- La operación es atómica desde la perspectiva del backend: el tag pasa a `LISTO` solo
  cuando la lectura de prueba verifica. Si el cambio de llaves quedó a medias, la
  herramienta muestra qué llaves se cambiaron y permite reintentar con la `keyVersion`
  emitida, que el backend conserva asociada al UID.
- Los desplazamientos de PICCData y CMAC dentro del NDEF se calculan a partir de la
  plantilla que entrega el backend; no se escriben a mano.
- El operador confirma cada chip; no hay modo por lotes sin confirmación.

## 4. Alta de lote

Antes de personalizar, el lote se registra con proveedor, fecha y cantidad, y los UIDs se
leen uno a uno con la herramienta o se cargan desde el archivo del proveedor. Un chip que
no pertenece a un lote registrado no se personaliza.

## 5. Seguridad

| Medida | Detalle |
|---|---|
| Acceso | Solo cuentas con rol `admin`; el backend rechaza cualquier otra |
| Bitácora | `EMITIR_LLAVES_TAG` y `MARCAR_TAG_LISTO` con el UID y el operador |
| Dispositivo | Bloqueo de pantalla obligatorio; la sesión caduca al cerrar la app |
| Red | Solo HTTPS al dominio configurado |
| Llaves de fábrica | La herramienta solo autentica con la llave de fábrica en chips en estado `FABRICADO`; un chip `LISTO` no se reprograma desde aquí sin una acción administrativa previa que lo devuelva a `FABRICADO` |
| Integridad de la app | Opcional: verificación con Play Integrity en el backend si la herramienta se distribuye a más de un operador |

## 6. Pantallas

1. Inicio de sesión.
2. Lotes: lista y alta.
3. Personalizar: guía de acercamiento, progreso por paso, resultado.
4. Diagnóstico: leer un chip y mostrar UID, originalidad, estado en el backend y última
   lectura verificada, sin tocar llaves.

## 7. Pruebas

- Unitarias del cálculo de desplazamientos y del armado de comandos.
- Manuales con la lista del documento 10 §5 en el entorno de pruebas antes de tocar el
  de producción.

## 8. Respaldo de escritorio

Si la herramienta Android no está disponible, la personalización puede hacerse desde una
PC con un lector USB compatible y un script que hable con el chip por APDU siguiendo la
misma secuencia. Se documenta como plan de contingencia; no es el camino principal.
