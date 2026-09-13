// Copia el contrato OpenAPI del backend a este repo y fija su huella en
// contract/contract.lock.json (docs/05 §6). La app siempre compila contra la
// copia versionada aquí; actualizarla es una decisión explícita.
//
//   WEB_REPO_PATH="ruta/al/repo/esperanza-animal" npm run contract:pull
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_RELATIVE_PATH = join("contract", "openapi.json");
const LOCK_PATH = join(root, "contract", "contract.lock.json");
const DESTINATION = join(root, CONTRACT_RELATIVE_PATH);

const webRepoPath = process.env.WEB_REPO_PATH?.trim();
if (!webRepoPath) {
  console.error("Define WEB_REPO_PATH con la ruta al repositorio esperanza-animal (backend).");
  process.exit(1);
}
const source = join(webRepoPath, CONTRACT_RELATIVE_PATH);
if (!existsSync(source)) {
  console.error(`No existe el contrato en ${source}. Genera primero: npm run contract:build en el backend.`);
  process.exit(1);
}

const content = readFileSync(source, "utf8");
const document = JSON.parse(content);
const sha256 = createHash("sha256").update(content).digest("hex");

mkdirSync(dirname(DESTINATION), { recursive: true });
writeFileSync(DESTINATION, content, "utf8");
writeFileSync(
  LOCK_PATH,
  `${JSON.stringify(
    {
      apiVersion: document.info?.version ?? null,
      title: document.info?.title ?? null,
      sha256,
      pulledAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`Contrato copiado (${document.info?.title} v${document.info?.version}, sha256 ${sha256.slice(0, 12)}).`);
console.log("Ahora regenera el cliente: npm run api:generate");
