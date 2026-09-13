# Documentación de arquitectura · Esperanza Animal móvil

Fecha de la primera versión: 2026-09-13. Esta carpeta es la fuente de verdad del diseño
del sistema móvil y de las extensiones del backend que lo hacen posible. Cualquier
decisión que contradiga estos documentos se registra primero como ADR y después se
actualiza el documento afectado.

## Cómo leer esta documentación

1. **[01 Requisitos](01-requisitos.md)**: qué debe cumplir el sistema. Cada requisito tiene
   un identificador estable que se usa en el plan y en los commits.
2. **[02 Arquitectura](02-arquitectura.md)**: cómo se organiza el sistema para cumplirlos.
3. **[03 Modelo de datos](03-modelo-de-datos.md)**, **[04 Seguridad NFC](04-seguridad-nfc-sun.md)**,
   **[05 Contrato de API](05-api-contrato.md)**, **[06 App móvil](06-app-movil.md)** y
   **[07 Personalización](07-herramienta-personalizacion.md)**: el detalle por componente.
4. **[08 Entorno y CI/CD](08-entorno-y-cicd.md)**: lo que hace falta para desarrollar y publicar.
5. **[09 Plan de trabajo](09-plan-de-trabajo.md)**: las secciones en el orden en que se
   ejecutan, con criterios de aceptación.
6. **[10 Preparación de tags](10-preparacion-tags.md)**: la lista para el día que lleguen los chips.
7. **[ADR](adr/README.md)**: por qué se decidió cada cosa y qué se descartó.

## Convenciones

- **Nada de valores mágicos.** Todo número o texto con significado de producto aparece en
  la tabla de parámetros del documento 01 con el nombre de la constante que lo
  representará en código. Los documentos posteriores citan el nombre, no el valor.
- **Identificadores en inglés, valores de enumeración en español**, como ya hace el
  proyecto web (`PublicationStatus.ACTIVA`, `AlertType.AVISTAMIENTO`).
- **Nombres de pantalla** con el código del diseño original cuando existe (`2a`, `3f`, `4d`).
  Las pantallas nuevas reciben códigos de la serie `M` (móvil) y se listan en el documento 06.
- **No se documenta lo que no existe.** Cuando un documento describe el proyecto web,
  describe lo que hay en el código a la fecha; lo nuevo se marca como «nuevo» o «cambio».

## Glosario

| Término | Significado |
|---|---|
| **Caso** | Una publicación de mascota perdida o encontrada (`Publication` en el esquema actual). Es un episodio con ciclo de vida 14/83/90 días. |
| **Mascota** | Entidad permanente con perfil, fotos y estado. Nueva en este diseño. |
| **Guardián** | Usuario vinculado a una mascota con rol `DUENO` o `GUARDIAN`. |
| **Finder** | Persona que encuentra al animal y escanea el collar. Casi nunca tiene la app. |
| **Tag** | Chip NFC NTAG 424 DNA montado en el collar. |
| **SUN / SDM** | Secure Unique NFC / Secure Dynamic Messaging: la función del chip que genera una URL firmada distinta en cada lectura. |
| **PICCData** | Bloque cifrado dentro de la URL con el UID del chip y el contador de lecturas. |
| **CMAC** | Firma de la URL calculada por el chip con una llave que no sale de él. |
| **Token de escaneo** | Credencial de un solo uso que el servidor emite tras verificar una lectura. Prueba de presencia física. |
| **Nivel de confianza** | `NFC_VERIFICADO` o `QR_SIN_VERIFICAR`. Decide qué acciones habilita un escaneo. |
| **Modo perdido** | Estado `PERDIDA` de la mascota. Al activarlo se crea un caso prellenado. |
| **Personalización** | Proceso interno que cambia las llaves de fábrica del chip, configura SUN y escribe la URL. |
| **Lote** | Conjunto de tags comprados juntos, con proveedor y fecha. Unidad de revocación. |
| **App Clip** | Experiencia instantánea de iOS que se abre al acercar el tag sin instalar la app. Fase posterior. |
| **TWA** | Trusted Web Activity: la app actual de Play Store, que envuelve la web. Será reemplazada por la app nativa con el mismo identificador. |
