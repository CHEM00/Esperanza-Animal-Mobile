# 07 · Herramienta interna de personalización de tags

Herramienta de línea de comandos de uso exclusivo de sysosa para dejar cada chip en estado
`LISTO`. Corre en la computadora del operador con el lector USB **ACR122U** y vive en
`tools/personalizador/` del repositorio del backend (ADR-007, ADR-012). No se publica ni
se distribuye: la ejecuta el operador con su sesión de administrador.

## 1. Alcance

Hace: verificar originalidad, cambiar las cinco llaves, configurar SUN, escribir la URL,
comprobar una lectura con el servidor y registrar el resultado. No hace: asignar mascotas,
ver datos de usuarios ni consultar escaneos. Todo eso vive en la web de administración.

## 2. Stack

| Capa | Elección | Motivo |
|---|---|---|
| Lenguaje | TypeScript ejecutado con `tsx`; paquete propio con su `package.json` | Reutiliza `src/lib/nfc` del backend (AES-CMAC, diversificación, SUN) sin duplicarlo ni licencias |
| NFC | Lector ACR122U por PC/SC (`nfc-pcsc`); comandos del NTAG 424 DNA como APDU ISO 7816-4 | La hoja de datos NT4H2421Gx y AN12196 documentan cada comando con vectores de prueba |
| Red | `fetch` contra los endpoints internos con los tipos del contrato OpenAPI | Mismos tipos que la API |
| Sesión | Token portador de un administrador (inicio de sesión por navegador y pegado del token; en local, `scripts/dev-session.mjs --admin`) | Reutiliza Better Auth y el rol `admin` |
| Arquitectura | Módulos puros (tramas, mensajería segura EV2, desplazamientos SDM) separados del adaptador PC/SC; flujo por pasos con confirmación | Probable sin lector; el adaptador es la única pieza con hardware |

## 3. Flujo de personalización

```mermaid
sequenceDiagram
  participant O as Operador
  participant H as Herramienta
  participant C as Chip
  participant B as Backend
  O->>H: coloca el chip en el lector
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
