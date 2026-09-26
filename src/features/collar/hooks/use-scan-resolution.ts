import { useEffect, useRef, useState } from "react";
import { messageForError } from "@/core/errors/problem-messages";
import { getScanPreview, resolveNfcScan, resolveQrScan, type ScanResolution } from "../repository";
import { planScanNavigation, type ScanNavigation } from "../scan-strategies";
import type { ParsedScanUrl } from "../scan-url";

/**
 * Resuelve una lectura de collar contra el servidor una sola vez (cada
 * resolución abre una sesión de escaneo) y devuelve a dónde navegar. Para la
 * vista de guardián pide además qué mascota es, porque la resolución no lo
 * dice y la app abre su perfil. El estado visible se deriva: mientras no hay
 * resultado para la lectura actual, está «resolviendo».
 */
export type ScanResolutionState =
  | { status: "idle" }
  | { status: "resolving" }
  | { status: "ready"; navigation: ScanNavigation; resolution: ScanResolution; petId: string | null }
  | { status: "invalid" }
  | { status: "error"; message: string };

type ScanInput = Extract<ParsedScanUrl, { kind: "nfc" | "qr" }>;
type Outcome = Extract<ScanResolutionState, { status: "ready" | "error" }>;

function keyOf(input: ScanInput): string {
  return input.kind === "nfc" ? `nfc:${input.p}:${input.m}` : `qr:${input.code}`;
}

async function resolveScan(input: ScanInput): Promise<Outcome> {
  try {
    const resolution =
      input.kind === "nfc" ? await resolveNfcScan({ p: input.p, m: input.m }) : await resolveQrScan(input.code);
    const navigation = planScanNavigation(resolution);
    const petId = navigation.kind === "guardian" ? (await getScanPreview(navigation.token)).petId : null;
    return { status: "ready", navigation, resolution, petId };
  } catch (error) {
    return { status: "error", message: messageForError(error) };
  }
}

export function useScanResolution(parsed: ParsedScanUrl | null): ScanResolutionState {
  const [stored, setStored] = useState<{ key: string; outcome: Outcome } | null>(null);
  const inFlight = useRef<string | null>(null);
  const input = parsed && (parsed.kind === "nfc" || parsed.kind === "qr") ? parsed : null;
  const key = input ? keyOf(input) : null;

  useEffect(() => {
    if (!input || !key || inFlight.current === key || stored?.key === key) {
      return;
    }
    inFlight.current = key;
    let active = true;
    void resolveScan(input).then((outcome) => {
      if (active) {
        setStored({ key, outcome });
      }
    });
    return () => {
      active = false;
    };
  }, [input, key, stored?.key]);

  if (!parsed) {
    return { status: "idle" };
  }
  if (!input || !key) {
    return { status: "invalid" };
  }
  return stored?.key === key ? stored.outcome : { status: "resolving" };
}
