import deepLinkPaths from "../../../config/deep-link-paths.json";

/**
 * Enlaces profundos (docs/06 §5): la única fuente de rutas del dominio que
 * abren la app está en config/deep-link-paths.json, compartida con
 * app.config.ts. Aquí se resuelve una URL entrante a una ruta de la app.
 * Módulo puro.
 */

export type DeepLinkKind =
  | "tagScan"
  | "qrScan"
  | "finder"
  | "publication"
  | "guardianInvite"
  | "petTransfer";

export interface ResolvedDeepLink {
  kind: DeepLinkKind;
  /** Segmento tras el prefijo para patrones `/x/*`; null para rutas exactas. */
  segment: string | null;
  query: Record<string, string>;
}

export interface LinkDomains {
  linkDomain: string;
  scheme: string;
}

interface DeepLinkPattern {
  id: DeepLinkKind;
  pattern: string;
}

const PATTERNS: readonly DeepLinkPattern[] = deepLinkPaths.paths.map((entry) => ({
  id: entry.id as DeepLinkKind,
  pattern: entry.pattern,
}));

/** Rutas internas de la app (docs/06 §4). Única fuente para navegar por código. */
export const APP_ROUTES = {
  feed: "/inicio",
  map: "/mapa",
  alerts: "/alertas",
  profile: "/perfil",
  login: "/login",
  updateRequired: "/actualizar",
  scanResolve: "/collar/resolver",
  finder: (token: string) => `/encontre/${encodeURIComponent(token)}`,
  publication: (id: string) => `/publicacion/${encodeURIComponent(id)}`,
  guardianInvite: (code: string) => `/invitacion/${encodeURIComponent(code)}`,
  petTransfer: (code: string) => `/transferencia/${encodeURIComponent(code)}`,
} as const;

function parseIncoming(url: string, domains: LinkDomains): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const isHttpsOnDomain =
    parsed.protocol === "https:" && parsed.hostname.toLowerCase() === domains.linkDomain.toLowerCase();
  const isAppScheme = parsed.protocol === `${domains.scheme}:`;
  return isHttpsOnDomain || isAppScheme ? parsed : null;
}

function matchPattern(pathname: string, pattern: string): { matched: boolean; segment: string | null } {
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2);
    if (pathname === prefix || !pathname.startsWith(`${prefix}/`)) {
      return { matched: false, segment: null };
    }
    const rest = pathname.slice(prefix.length + 1);
    return rest.length > 0 && !rest.includes("/")
      ? { matched: true, segment: decodeURIComponent(rest) }
      : { matched: false, segment: null };
  }
  return { matched: pathname === pattern, segment: null };
}

export function resolveDeepLink(url: string, domains: LinkDomains): ResolvedDeepLink | null {
  const parsed = parseIncoming(url, domains);
  if (!parsed) {
    return null;
  }
  // Con esquema propio, el "host" es el primer segmento: alakito://t?p=...
  const pathname =
    parsed.protocol === "https:" ? parsed.pathname : `/${parsed.host}${parsed.pathname}`;
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  for (const { id, pattern } of PATTERNS) {
    const { matched, segment } = matchPattern(normalized, pattern);
    if (matched) {
      return { kind: id, segment, query: Object.fromEntries(parsed.searchParams.entries()) };
    }
  }
  return null;
}

/** Ruta de la app a la que navegar para un enlace resuelto. */
export function hrefForDeepLink(link: ResolvedDeepLink): string {
  switch (link.kind) {
    case "tagScan": {
      const params = new URLSearchParams(link.query);
      return `${APP_ROUTES.scanResolve}?${params.toString()}`;
    }
    case "qrScan":
      return `${APP_ROUTES.scanResolve}?code=${encodeURIComponent(link.segment ?? "")}`;
    case "finder":
      return APP_ROUTES.finder(link.segment ?? "");
    case "publication":
      return APP_ROUTES.publication(link.segment ?? "");
    case "guardianInvite":
      return APP_ROUTES.guardianInvite(link.segment ?? "");
    case "petTransfer":
      return APP_ROUTES.petTransfer(link.segment ?? "");
  }
}
