// Sincroniza los design tokens desde la web (docs/06 §10): lee
// src/styles/tokens.css (temas claro y oscuro) y el bloque @theme de
// src/app/globals.css (radios) del repo backend, y genera
// src/core/theme/tokens.generated.ts. Ningún color se escribe a mano en la
// app. Con --check no escribe: falla si el archivo commiteado difiere.
//
//   WEB_REPO_PATH="ruta/al/repo/esperanza-animal" npm run tokens:sync
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_PATH = join(root, "src", "core", "theme", "tokens.generated.ts");
const TOKENS_CSS = join("src", "styles", "tokens.css");
const GLOBALS_CSS = join("src", "app", "globals.css");
const LIGHT_SELECTOR = ":root";
const DARK_SELECTOR = '[data-theme="dark"]';
const RADIUS_PREFIX = "--radius-";
const HEADER =
  "// Generado por scripts/sync-tokens.mjs desde tokens.css y globals.css del repo web. No editar a mano.\n";

const checkOnly = process.argv.includes("--check");

/** Bloque `selector { ... }` de un CSS (sin bloques anidados). */
function cssBlock(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) {
    throw new Error(`No se encontró el bloque ${selector}`);
  }
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

/** `--nombre: valor;` → { nombre: valor }, ignorando comentarios y `initial`. */
function customProperties(block, prefixFilter = "--") {
  const withoutComments = block.replace(/\/\*[\s\S]*?\*\//g, "");
  const result = {};
  for (const match of withoutComments.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const [, name, rawValue] = match;
    const value = rawValue.trim();
    if (!name.startsWith(prefixFilter) || value === "initial" || name.includes("*")) {
      continue;
    }
    result[name] = value;
  }
  return result;
}

function toCamel(cssName) {
  return cssName
    .replace(/^--(radius-)?/, "")
    .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/** Solo colores y sombras planos: las variables que referencian otras (var(--x)) o fuentes quedan fuera. */
function isPortableValue(name, value) {
  return !value.includes("var(") && !name.startsWith("--font-");
}

function buildModule(light, dark, radii) {
  const lightKeys = Object.keys(light).filter((name) => isPortableValue(name, light[name]));
  const entries = (source) =>
    lightKeys
      .map((name) => `  ${toCamel(name)}: ${JSON.stringify(source[name] ?? light[name])},`)
      .join("\n");
  const radiusEntries = Object.entries(radii)
    .map(([name, value]) => `  ${toCamel(name)}: ${Number.parseInt(value, 10)},`)
    .join("\n");
  return `${HEADER}
export const lightTokens = {
${entries(light)}
} as const;

export const darkTokens = {
${entries(dark)}
} as const;

/** Radios en puntos (la web los define en px). */
export const radii = {
${radiusEntries}
} as const;

/** Mismas llaves en ambos temas; los valores difieren, por eso no es \`typeof lightTokens\`. */
export type ColorTokens = { readonly [K in keyof typeof lightTokens]: string };
`;
}

function generate() {
  const webRepoPath = process.env.WEB_REPO_PATH?.trim();
  if (!webRepoPath) {
    throw new Error("Define WEB_REPO_PATH con la ruta al repositorio esperanza-animal (backend).");
  }
  const tokensCss = readFileSync(join(webRepoPath, TOKENS_CSS), "utf8");
  const globalsCss = readFileSync(join(webRepoPath, GLOBALS_CSS), "utf8");

  const light = customProperties(cssBlock(tokensCss, LIGHT_SELECTOR));
  const dark = customProperties(cssBlock(tokensCss, DARK_SELECTOR));
  const radii = customProperties(cssBlock(globalsCss, "@theme inline"), RADIUS_PREFIX);
  if (Object.keys(radii).length === 0) {
    throw new Error("No se encontraron radios en el bloque @theme inline");
  }
  return buildModule(light, dark, radii);
}

if (checkOnly) {
  const current = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, "utf8") : "";
  if (!process.env.WEB_REPO_PATH) {
    // Sin el repo web a mano (CI) solo se comprueba que el archivo exista.
    if (!current) {
      console.error("Falta src/core/theme/tokens.generated.ts. Ejecuta: npm run tokens:sync");
      process.exit(1);
    }
    console.log("Tokens presentes (sin WEB_REPO_PATH no se comparan con la web).");
  } else if (current !== generate()) {
    console.error("Los tokens no coinciden con la web. Ejecuta: npm run tokens:sync");
    process.exit(1);
  } else {
    console.log("Tokens al día.");
  }
} else {
  writeFileSync(OUTPUT_PATH, generate(), "utf8");
  console.log(`Tokens generados en ${OUTPUT_PATH}`);
}
