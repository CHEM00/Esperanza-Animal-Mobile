/**
 * Actualización obligatoria (RF-N3): la configuración remota trae la versión
 * mínima soportada y la app compara la suya. Módulo puro.
 */

const SEMVER_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;

function parseSemver(version: string): [number, number, number] {
  const match = SEMVER_PATTERN.exec(version.trim());
  if (!match) {
    throw new Error(`Versión inválida: ${version}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Negativo si a < b, cero si iguales, positivo si a > b. */
export function compareSemver(a: string, b: string): number {
  const left = parseSemver(a);
  const right = parseSemver(b);
  for (let index = 0; index < 3; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}

export function isUpdateRequired(
  currentVersion: string,
  minSupportedVersion: string | null,
): boolean {
  if (minSupportedVersion === null) {
    return false;
  }
  return compareSemver(currentVersion, minSupportedVersion) < 0;
}
