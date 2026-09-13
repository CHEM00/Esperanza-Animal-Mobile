# 04 · Seguridad del sistema NFC (NTAG 424 DNA, SUN/SDM)

Fuente de verdad del diseño criptográfico y anti-abuso del collar. Referencias oficiales:
hoja de datos NXP NT4H2421Gx (NTAG 424 DNA), nota de aplicación NXP AN12196 (funciones
SDM y vectores de prueba) y AN10922 (diversificación de llaves AES). Implementación de
referencia pública para contraste: proyecto `icedevml/sdm-backend` y su demo
`sdm.nfcdeveloper.com`.

## 1. El chip que se compró

| Propiedad | Valor | Implicación |
|---|---|---|
| Chip | NXP NTAG 424 DNA | Único chip de consumo con SUN: URL firmada distinta en cada lectura |
| UID | 7 bytes | Identificador de fábrica; base de la diversificación de llaves |
| Memoria de usuario | 416 bytes; archivo NDEF de 256 bytes | La URL firmada cabe con margen |
| Estándar | ISO 14443-A, NFC Forum **Type 4** | La ficha del vendedor dice Type 2; es un error de plantilla. Verificar con NXP TagInfo |
| Llaves | 5 llaves AES-128 (0 a 4) | Roles en §3 |
| Contador de lecturas | 24 bits | Anti-replay; se agota en 16 777 215 lecturas |
| Antena del token | 11 mm | Rango corto; exige puntería y montaje lejos de metal |

## 2. Qué contiene el tag

Un solo registro NDEF de tipo URL. Ningún dato personal. La URL es una plantilla en la
que el chip sustituye, en cada lectura, dos zonas a desplazamientos fijos:

```
https://<dominio>/t?p=<PICCData cifrado, 32 hex>&m=<CMAC, 16 hex>
```

- `p`: UID y contador cifrados con la llave SDMMetaRead. Un lector ajeno no puede
  rastrear al animal por su UID.
- `m`: firma calculada con una llave de sesión derivada de la llave SDMFileRead **de ese
  tag** y del contador. La entrada del CMAC es vacía (SDMMACInputOffset igual a
  SDMMACOffset). No se usa cifrado de datos de archivo porque el tag no guarda datos.

Ruta, nombres de parámetros y dominio son constantes de configuración del backend.
Longitud aproximada de la URL: 90 caracteres.

## 3. Llaves y roles

| Llave del chip | Rol | Diversificada por tag | Secreto maestro en el backend |
|---|---|---|---|
| Key 0 | AppMasterKey: autoriza cambiar llaves y reconfigurar | Sí | `NFC_APP_MASTER_KEY_V1` |
| Key 1 | SDMMetaReadKey: descifra PICCData | **No** (común) | `NFC_META_READ_KEY_V1` |
| Key 2 | SDMFileReadKey: firma CMAC | Sí | `NFC_FILE_READ_MASTER_KEY_V1` |
| Key 3, Key 4 | Sin uso; se fijan a valores diversificados para no dejar llaves de fábrica | Sí | Derivadas de `NFC_APP_MASTER_KEY_V1` con propósito distinto |

**Por qué la Key 1 es común.** El servidor debe descifrar PICCData antes de conocer el
UID, y sin UID no puede derivar una llave por tag. Es el diseño de referencia de NXP. Si
esa llave se filtra, un atacante lee UID y contador de cualquier tag, pero no puede
firmar: la Key 2 sigue siendo por tag. Se mitiga con **versión de llave**: cada tag
registra `keyVersion`; una rotación introduce `NFC_META_READ_KEY_V2` y los tags nuevos la
usan sin invalidar los anteriores.

**Diversificación (AN10922, AES-128).** Llave del tag = CMAC(llave maestra,
`0x01` || UID || identificador de aplicación || identificador de sistema). El identificador
de sistema es la variable `NFC_SYSTEM_IDENTIFIER`, no un literal en código.

**Custodia.**
- Las llaves maestras se generan con un generador criptográfico, 16 bytes, y viven en el
  gestor de secretos del despliegue. Respaldo en bóveda con dos custodios.
- Nunca se escriben en logs ni se devuelven por API. El endpoint de personalización
  devuelve únicamente llaves **derivadas** para un UID concreto, a un cliente interno
  autenticado con rol administrador, con bitácora `EMITIR_LLAVES_TAG`.
- Ningún tag sale a la calle con llaves de fábrica (todo ceros).

## 4. Verificación de una lectura, paso a paso

Entrada: `p` y `m` en hexadecimal. Salida: UID, contador, resultado (`ScanResult`).

1. **Formato.** `p` de 32 hex y `m` de 16 hex; si no, `FORMATO_INVALIDO`.
2. **Descifrar PICCData.** AES-128-CBC con la llave SDMMetaRead de la versión vigente e
   IV de 16 bytes en cero sobre los 16 bytes de `p`. Si hay varias versiones activas se
   intenta de la más reciente a la más antigua.
3. **Interpretar el bloque.** Byte 0 es PICCDataTag: bit 7 indica UID presente, bit 6
   contador presente, los 4 bits bajos la longitud del UID. Siguen 7 bytes de UID y 3
   bytes de contador en **little-endian**. El resto es relleno aleatorio.
4. **Buscar el tag** por UID. Si no existe: `TAG_DESCONOCIDO`.
5. **Derivar la llave SDMFileRead** del tag con la maestra de su `keyVersion`.
6. **Derivar la llave de sesión de MAC.** SV2 = `3C C3 00 01 00 80` || UID || contador,
   rellenado con ceros a 16 bytes. KsesMAC = CMAC(KfileRead, SV2).
7. **Calcular el CMAC** sobre la entrada vacía con KsesMAC y truncar a 8 bytes tomando los
   bytes en posiciones impares (1, 3, 5, … 15). Comparar con `m` en tiempo constante. Si
   no coincide: `FIRMA_INVALIDA`.
8. **Anti-replay.** Si contador <= `lastCounter` del tag: `REPLAY`; se incrementa
   `replayCount` y, al superar `REPLAY_SUSPICION_THRESHOLD`, se avisa a guardianes y
   administración.
9. **Estado del tag.** `ACTIVO` produce vista de guardián o finder; `LISTO` produce vista
   de activación solo con sesión; `EN_REVISION`, `REVOCADO` y `FABRICADO` producen
   `TAG_INACTIVO` con vista neutra. Se actualiza `lastCounter` en todos los casos con
   firma válida.
10. **Emitir token de escaneo** (§5) y registrar el `Scan` con resultado `VALIDO`.

Constantes de referencia para cifrado de datos de archivo, no usadas hoy: SV1 =
`C3 3C 00 01 00 80` || UID || contador; IV = AES-ECB(KsesENC, contador || 13 bytes en cero).

### Vectores de prueba

Los vectores oficiales están en AN12196 y se transcriben desde el documento de NXP al
implementar; no se copian aquí para no arrastrar errores de transcripción. Como prueba
pública adicional, la demo `sdm.nfcdeveloper.com` publica lecturas generadas con
**llaves de fábrica (todo ceros)**. Con esas llaves el verificador debe aceptar:

```
picc_data=EF963FF7828658A599F3041510671E88   cmac=94EED9EE65337086
```

y, en modo de texto plano (UID y contador sin cifrar; solo para probar el CMAC):

```
uid=041E3C8A2D6B80   ctr=000006   cmac=4B00064004B0B3D3
```

La suite del verificador incluye ambos con llaves cero y, cuando lleguen los chips, una
lectura real capturada con el modo de diagnóstico (documento 10).

## 5. Token de escaneo

La verificación no muestra datos: emite un **token de escaneo** y redirige. Es la prueba
de presencia física que exigen las acciones sensibles.

| Propiedad | Regla | Dónde |
|---|---|---|
| Vida | `SCAN_TOKEN_TTL_MINUTES` | `ScanSession.expiresAt` |
| Uso | Una sola acción de aviso por token | `ScanSession.consumedAt` |
| Ligado a | tag, contador, nivel de confianza, hora | `ScanSession` |
| Formato | 32 bytes aleatorios en base64url; la base guarda solo el hash SHA-256 | `ScanSession.tokenHash` |

Rutas que exigen token válido y no consumido: avisar al dueño, enviar ubicación o foto
del hallazgo, abrir canal de contacto, activar collar. Sin token, expirado o consumido:
pantalla neutra «acerca tu teléfono al collar». La respuesta es idéntica en los tres casos.

## 6. Niveles de confianza (ADR-008)

| Nivel | Origen | Habilita | Límites | Etiqueta al guardián |
|---|---|---|---|---|
| `NFC_VERIFICADO` | URL SUN válida | Aviso, ubicación, foto, canal de contacto, activación | `SCAN_ALERT_COOLDOWN_MINUTES` por tag y dispositivo | «Escaneo verificado» |
| `QR_SIN_VERIFICAR` | QR estático impreso | Aviso, ubicación, foto | `UNVERIFIED_ALERT_COOLDOWN_MINUTES`, `UNVERIFIED_ALERTS_PER_TAG_PER_DAY`, sin canal de contacto ni activación | «Aviso sin verificar» |

Cada nivel es una estrategia con la misma interfaz: acciones permitidas, política de
límites, etiqueta y prioridad de notificación.

## 7. Cadena de políticas anti-abuso

Cada aviso pasa por una cadena ordenada; la primera política que rechaza detiene el flujo
y registra el motivo en el `Scan`.

| Orden | Política | Regla |
|---|---|---|
| 1 | Token | Vigente y no consumido |
| 2 | Estado del tag | `ACTIVO`; `EN_REVISION` rechaza |
| 3 | Silencio | `Tag.mutedUntil` en el futuro rechaza con mensaje al finder de que el dueño ya fue avisado |
| 4 | Cooldown | Por tag y huella de dispositivo según nivel |
| 5 | Límite diario | Solo nivel sin verificar |
| 6 | Agrupación | Dentro de `SCAN_ALERT_GROUPING_WINDOW_MINUTES` se adjunta al aviso anterior en lugar de crear otro |

## 8. Amenazas y mitigaciones

| Amenaza | Mitigación |
|---|---|
| Tag clonado (URL copiada a otro chip) | El contador no avanza: `REPLAY`. Se registra; al superar el umbral se alerta |
| URL fotografiada y reenviada | Igual que clonado |
| URL inventada | CMAC inválido sin la llave por tag |
| Spam al dueño | Cooldown, agrupación, silencio, congelación |
| **Cita trampa** (avisar «lo tengo» para citar al dueño) | Ubicación del finder siempre aproximada y nunca como punto de encuentro; sugerencia de lugar público; contacto por relevo salvo opt-in; «reportar sospechoso» congela el tag; avisos de mascotas `EN_CASA` llegan con prioridad baja |
| Collar robado y usado para localizar al dueño | El perfil público nunca muestra dirección ni nombre del dueño (ADR-011) |
| Rastreo del animal por UID | PICCData cifrado |
| Fuga de la llave SDMMetaRead | Pierde privacidad de UID, no integridad; rotación por `keyVersion` |
| Fuga de una llave maestra | Rotación por versión; los tags del lote afectado se reprograman o revocan |
| Chips falsificados | Firma de originalidad con NXP TagInfo antes de personalizar; lotes con proveedor y fecha; revocación por lote |
| Tag con llaves de fábrica | `LISTO` solo se alcanza tras cambiar las cinco llaves y verificar una lectura |
| Fuerza bruta contra `/t` y `/q` | `API_RATE_LIMIT_SCAN_PER_MINUTE` por IP y dispositivo; respuesta idéntica para inválido, desconocido y replay |
| Enumeración de códigos QR | `PET_PUBLIC_CODE_LENGTH` con aleatoriedad criptográfica; mismo rate limit |
| Fuga de la base de datos | Contactos cifrados (ADR-004); el registro de escaneos guarda ubicación redondeada y hashes, no identificadores |

## 9. Ciclo de vida del tag (máquina de estados)

| Desde | Evento | Hacia | Quién |
|---|---|---|---|
| — | Alta de lote | `FABRICADO` | Administración |
| `FABRICADO` | Personalización completada y lectura de prueba verificada | `LISTO` | Herramienta interna |
| `LISTO` | Activación por dueño con escaneo verificado | `ACTIVO` | Dueño en la app |
| `ACTIVO` | Reporte de sospecha o replays sobre el umbral | `EN_REVISION` | Sistema |
| `EN_REVISION` | Resolución administrativa con motivo | `ACTIVO` o `REVOCADO` | Administración |
| `ACTIVO` | Desvinculación o transferencia | `LISTO` | Dueño o administración |
| Cualquiera | Revocación (lote falso, robo confirmado) | `REVOCADO` | Administración |

El modo perdido no es un estado del tag: es `Pet.status = PERDIDA`. Las transiciones viven
en una tabla explícita en código; cualquier transición fuera de la tabla es un error de
dominio.

## 10. Registro, auditoría y retención

- Cada lectura, válida o no, crea un `Scan` con tag, contador recibido, resultado, nivel,
  vista resuelta, hora, usuario si había sesión, ubicación aproximada si el finder la
  concedió y hashes de dispositivo e IP.
- Retención `SCAN_LOG_RETENTION_MONTHS`; purga en `runRetention()`.
- Toda acción administrativa sobre tags va a `AdminActionLog` con motivo.
- El aviso de privacidad declara el escaneo, la ubicación aproximada del finder y la
  retención, con consentimiento en la propia pantalla del finder.
