# ADR-001 · React Native + Expo para la app de consumo

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

Se necesita una app para Android e iOS con enlaces profundos desde tags NFC, push, mapas
con marcadores por caso, cámara, ubicación y lectura NFC en primer plano como respaldo. El
backend concentra las reglas de negocio y pasará a exponer una API. El equipo domina
TypeScript y React; el desarrollo se hace en Windows sin Mac.

## Decisión

La app de consumo se construye con React Native usando Expo (Expo Router, EAS Build, EAS
Submit) en TypeScript. El código nativo se limita a piezas que lo exigen y se aísla: App
Clip de iOS (Swift, fase posterior) y la herramienta interna de personalización (Kotlin,
repositorio aparte, ADR-007).

## Alternativas consideradas

- **Dos apps nativas (Kotlin/Compose y Swift/SwiftUI).** Máxima fidelidad por plataforma.
  Descartada porque ningún requisito la exige: el flujo NFC lo resuelve el sistema
  operativo y la seguridad vive en el servidor. Duplica UI, pruebas y mantenimiento sin
  tocar el valor del producto.
- **Kotlin Multiplatform.** Útil con lógica de cliente pesada. Aquí el cliente es delgado
  y el contrato generado ya evita duplicar modelos. Descartada por ahora.
- **Flutter.** Pinta sus propios widgets; contradice el objetivo de sensación nativa.

## Consecuencias

- Se renuncia a algo de fidelidad con el rediseño de iOS 26 y a adoptar APIs nuevas el
  día uno.
- Módulos NFC y mapas dependen de librerías de la comunidad; se aíslan detrás de puertos
  propios para poder sustituirlas.
- Sin Mac se puede lanzar en App Store, pero no depurar Swift ni construir el App Clip.
