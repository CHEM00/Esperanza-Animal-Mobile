// Genera los tipos del cliente HTTP desde contract/openapi.json con
// openapi-typescript (docs/05 §6). Con --check no escribe: falla si el archivo
// commiteado difiere de lo que se generaría (para CI).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = join(root, "contract", "openapi.json");
const OUTPUT_PATH = join(root, "src", "core", "api", "generated", "schema.d.ts");
const HEADER =
  "// Generado por scripts/generate-api.mjs desde contract/openapi.json. No editar a mano.\n";

const checkOnly = process.argv.includes("--check");

if (!existsSync(CONTRACT_PATH)) {
  console.error("Falta contract/openapi.json. Ejecuta: npm run contract:pull");
  process.exit(1);
}

const ast = await openapiTS(new URL(`file:///${CONTRACT_PATH.replace(/\\/g, "/")}`), {
  exportType: false,
  alphabetize: true,
});
const generated = `${HEADER}${astToString(ast)}`;

if (checkOnly) {
  const current = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, "utf8") : "";
  if (current !== generated) {
    console.error(
      "El cliente generado no coincide con contract/openapi.json. Ejecuta: npm run api:generate",
    );
    process.exit(1);
  }
  console.log("Cliente generado al día.");
} else {
  writeFileSync(OUTPUT_PATH, generated, "utf8");
  console.log(`Tipos generados en ${OUTPUT_PATH}`);
}
