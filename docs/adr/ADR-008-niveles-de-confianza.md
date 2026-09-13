# ADR-008 · Dos niveles de confianza: NFC verificado y QR sin verificar

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

Una parte relevante de los teléfonos de gama baja en México no tiene NFC. Un QR impreso
no puede llevar firma dinámica.

## Decisión

Cada escaneo lleva un nivel de confianza explícito: `NFC_VERIFICADO` o
`QR_SIN_VERIFICAR`. El nivel se decide en el servidor y se modela con el patrón
Estrategia: cada nivel define qué acciones habilita, qué límites aplica y cómo se etiqueta
la alerta que recibe el guardián.

## Consecuencias

- El camino QR abre la misma pantalla, pero la alerta llega marcada «sin verificar», con
  límites más estrictos y sin canal de contacto ni activación de collar.
- Agregar un tercer nivel en el futuro no toca los flujos existentes.
