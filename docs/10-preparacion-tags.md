# 10 · Preparación para la llegada de los tags

Objetivo: que el día que lleguen los chips la prueba tome minutos y no exija cambios de
código. Todo lo que sigue se construye antes, en las secciones S1 y S2 del plan.

## 1. Qué debe existir antes de que lleguen

- [x] Verificador SUN en `lib/nfc` con pruebas en verde contra RFC 4493 y AN12196
      (documento 04 §4).
- [x] Migración `tags_and_scans` aplicada en local.
- [x] Ruta `GET /t` que verifica, registra el `Scan` y, con `NFC_SCAN_DIAGNOSTICS=true`,
      muestra una página con resultado, firma, vista, estado, UID, contador, versión de
      llaves y hora. En producción esa bandera está prohibida y la ruta redirige a `/collar`.
- [x] Endpoint `POST /api/v1/scans/nfc` respondiendo `view: NEUTRAL` para tags no activos
      y `ACTIVATION` para `LISTO` con sesión.
- [x] `.env` local con `NFC_ALLOW_FACTORY_KEYS=true` y `NFC_SCAN_DIAGNOSTICS=true` (la
      versión 0 de llaves es «fábrica»: todo ceros, sin diversificar).
- [x] `node scripts/seed-tag-prueba.mjs <UID>` crea el lote de pruebas y el tag en estado
      `LISTO` con versión 0. Probado con el UID del vector AN12196 p. 12.
- [ ] Backend accesible por HTTPS desde los teléfonos (túnel de desarrollo o el entorno de
      pruebas desplegado), porque los teléfonos abrirán la URL real.
- [ ] `assetlinks.json` y el archivo de asociación de Apple publicados, aunque la app aún
      no exista: permiten comprobar que el navegador abre la URL y dejan listo el terreno
      (sección S9).

## 2. Día uno: verificación del lote

1. **NXP TagInfo** en Android o iPhone sobre cada muestra: confirmar «NTAG 424 DNA», UID
   de 7 bytes y **firma de originalidad válida**. Anotar los UID.
2. Si algún chip falla la firma, apartarlo y documentarlo. No se personaliza.
3. Registrar el lote con el script de siembra: proveedor, fecha, cantidad, UIDs.

## 3. Primera lectura con llaves de fábrica

1. Con **NXP TagWriter** configurar un tag: registro NDEF de tipo URL con la plantilla del
   documento 04 §2 apuntando al entorno de pruebas; SDM habilitado con UID y contador
   cifrados en PICCData y CMAC habilitado; llaves de fábrica sin cambiar. Los nombres
   exactos de las opciones se confirman con la app y el chip en mano; los
   desplazamientos los calcula la propia app a partir de la plantilla.
2. Acercar el iPhone con pantalla encendida: debe aparecer la sugerencia del sistema y
   abrir la página de diagnóstico con resultado `VALIDO` y contador `1`.
3. Acercar un Android desbloqueado: mismo resultado con contador `2`.
4. Repetir con la misma URL pegada en el navegador: resultado `REPLAY`.
5. Guardar una lectura real como vector adicional en la suite del verificador.

## 4. Pruebas físicas

| Prueba | Qué se mide | Criterio |
|---|---|---|
| Rango | Distancia máxima de lectura con iPhone y Android | Se documenta; define instrucciones del empaque |
| Puntería | Tiempo hasta lectura con el teléfono en mano, sin ver el token | Menos de 3 segundos en la mayoría de intentos |
| Montaje | Lectura a través del material de encapsulado y a distintas distancias de metal | Definir separación mínima de hebillas y argollas |
| Movimiento | Lectura con el collar puesto en un perro en movimiento | Se documenta el porcentaje de éxito |
| Agua | Lectura tras inmersión y secado | Sin degradación |

## 5. Paso a llaves reales

Solo cuando la herramienta de personalización (documento 07) esté lista:

1. Generar las llaves maestras en el gestor de secretos del entorno de pruebas.
2. Personalizar un tag: cambiar Key 0 a 4, configurar SDM, escribir la URL. El tag pasa a
   `LISTO`.
3. Repetir §3 puntos 2 a 4 con `keyVersion` igual a `NFC_KEY_VERSION_CURRENT`.
4. Intentar reconfigurar ese tag con TagWriter: debe fallar por falta de llave.

## 6. Cambio de código esperado el día de la prueba

Ninguno. Solo variables de entorno y un registro de tag por script. Si la prueba exige
tocar código, es un defecto de la preparación y se corrige en la sección S2 antes de
continuar.
