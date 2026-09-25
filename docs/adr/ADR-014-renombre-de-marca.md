# ADR-014 · La marca es «Alakito» y el dominio canónico es alakito.mx

- **Estado:** Aceptada · **Fecha:** 2026-09-25

## Contexto

«Esperanza Animal» es una marca registrada por un tercero en México. Seguir usándola en
la ficha de Play, en los collares y en el registro del IMPI era un riesgo legal. Hacía
falta un nombre propio, registrable, con significado para el producto y con dominio
libre. Las palabras base en náhuatl y maya están casi todas registradas; las familias
«huella», «patitas», «lomito», «pet» y «rescue» están saturadas en el sector.

## Decisión

- La marca es **Alakito**: maya _áalak'_ («animal criado en casa», mascota) más el
  diminutivo «-ito». Palabra inventada, sin coincidencias en MARCANET; la vecina más
  cercana («ALAKIT») está registrada solo en joyería (clases 14 y 35).
- El dominio canónico es **alakito.mx** (`BETTER_AUTH_URL`). Es el que se graba en los
  chips (documento 04) y el que reclaman los enlaces universales y App Links.
- `rescate.sysosa.com.mx` sigue sirviendo la app mientras el TWA publicado la reclame.
  Cuando la app nativa lo sustituya (sección S16) se activa `LEGACY_HOSTNAMES` en el
  backend: redirección 301 al dominio canónico conservando ruta y parámetros, con
  `/.well-known/*` exento.
- Cambian los elementos de marca: `APP_NAME` en ambos repos, slug de EAS (`alakito`),
  esquema propio de OAuth (`alakito://`), dominio de enlaces, claves de almacenamiento
  seguro de la app (aún sin instalaciones), título y URN de problemas del contrato
  (`urn:alakito:problema:`, sin clientes publicados), manifest, aviso de privacidad, README
  y esta documentación.
- **No cambian**, a propósito: el paquete Android y bundle iOS `mx.com.sysosa.rescate`
  (identidad publicada en Play; invisible para el usuario), los propósitos de derivación
  HKDF (`esperanza-animal/escaneo`, `esperanza-animal/indice-contacto`: cambiarlos
  invalidaría hashes e índices existentes), el formato de sobre `ea1.`, la cookie
  `ea-ciudad`, la base de datos local y los nombres de repositorio y carpeta.

## Alternativas consideradas

- **ES-CA-SA (Esperanza-Canina-Salcedo).** Nombre temporal en Expo. «Canina» excluye a
  gatos y otros animales, se lee «escasa» y no significa nada para el público.
- **Nican, Okaeri, Laakan, Otochi y otras palabras base.** Descartadas por coincidencias
  registradas o en trámite, varias en clase 9 o en el sector mascotas.
- **Variante de «Esperanza Animal».** Conservar la marca ajena con un añadido mantiene el
  conflicto fonético y de sector.

## Consecuencias

- Solicitud de marca en el IMPI en clases 9 y 42 (45 si el presupuesto alcanza); la fecha
  de solicitud fija la prioridad.
- La ficha de Play, la pantalla de consentimiento de OAuth y los textos de venta (S16)
  llevan la marca nueva. El proyecto de EAS debe tener el slug `alakito`.
- Las sesiones son por host: al cambiar de dominio los usuarios inician sesión otra vez y
  la PWA y las suscripciones push del dominio anterior no se transfieren.
- Los collares se graban con `https://alakito.mx/t` (sección S15); el dominio anterior
  queda como respaldo redirigido, no como URL de chip.
