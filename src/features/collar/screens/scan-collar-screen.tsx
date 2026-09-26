import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { appConfig } from "@/core/config";
import { DeviceQrScanner, nfcReader } from "@/core/device";
import { hrefForDeepLink, resolveDeepLink, scanResolveHref } from "@/core/navigation/links";
import type { NfcUnavailableReason } from "@/core/ports/nfc-reader";
import { useTheme } from "@/core/theme/use-theme";
import { SHELL_STRINGS } from "@/features/shell/strings";
import { AppText } from "@/shared/ui/app-text";
import { Card } from "@/shared/ui/card";
import { CtaButton } from "@/shared/ui/cta-button";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { LoadingView } from "@/shared/ui/loading-view";
import { ScrollScreen } from "@/shared/ui/scroll-screen";
import { SecondaryButton } from "@/shared/ui/secondary-button";
import { parseScanUrl } from "../scan-url";
import { COLLAR_STRINGS } from "../strings";

/**
 * M5 · Escanear collar en primer plano (RF-F7): lectura NFC de la URL y, como
 * respaldo en teléfonos sin NFC, el QR impreso con la cámara. La URL leída va
 * al mismo resolvedor que los enlaces universales.
 */
type ReaderState =
  | { status: "idle" }
  | { status: "reading" }
  | { status: "unavailable"; reason: NfcUnavailableReason }
  | { status: "message"; text: string };

const S = COLLAR_STRINGS.scan;
const QR_HEIGHT = 300;

export function ScanCollarScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [reader, setReader] = useState<ReaderState>({ status: "idle" });
  const [qrOpen, setQrOpen] = useState(false);
  const [qrMessage, setQrMessage] = useState<string | null>(null);
  const domains = useMemo(() => ({ linkDomain: appConfig.linkDomain, scheme: appConfig.scheme }), []);

  const hrefFor = useCallback(
    (url: string) => {
      const link = resolveDeepLink(url, domains);
      return link ? hrefForDeepLink(link) : null;
    },
    [domains],
  );

  /** Navega al resolvedor si la URL es de un collar del dominio; false si no lo es. */
  const handleUrl = useCallback(
    (url: string): boolean => {
      const parsed = parseScanUrl(url, domains, hrefFor);
      if (parsed.kind === "invalid") {
        return false;
      }
      router.replace((parsed.kind === "other" ? parsed.href : scanResolveHref(url)) as never);
      return true;
    },
    [domains, hrefFor, router],
  );

  const read = useCallback(async () => {
    setReader({ status: "reading" });
    const result = await nfcReader.readUrl({ prompt: S.prompt });
    switch (result.status) {
      case "url":
        if (!handleUrl(result.url)) {
          setReader({ status: "message", text: COLLAR_STRINGS.resolver.invalidUrl(SHELL_STRINGS.appName) });
        }
        return;
      case "cancelled":
        setReader({ status: "idle" });
        return;
      case "not_url":
        setReader({ status: "message", text: S.notUrl });
        return;
      case "unavailable":
        setReader({ status: "unavailable", reason: result.reason });
        if (result.reason === "unsupported") {
          setQrOpen(true);
        }
        return;
      case "failed":
        setReader({ status: "message", text: S.failed });
    }
  }, [handleUrl]);

  useEffect(() => {
    return () => {
      void nfcReader.cancel();
    };
  }, []);

  function onQrCode(data: string) {
    if (!handleUrl(data)) {
      setQrMessage(S.qrInvalid(SHELL_STRINGS.appName));
    }
  }

  return (
    <ScrollScreen>
      <Card>
        <AppText tone="muted">{S.intro}</AppText>
        <View style={styles.actions}>
          {reader.status === "reading" ? (
            <>
              <LoadingView label={S.reading} />
              <SecondaryButton
                label={S.cancel}
                onPress={() => {
                  void nfcReader.cancel();
                  setReader({ status: "idle" });
                }}
              />
            </>
          ) : (
            <>
              {reader.status === "message" ? <ErrorBanner message={reader.text} tone="warn" /> : null}
              {reader.status === "unavailable" ? (
                <ErrorBanner message={reader.reason === "disabled" ? S.disabled : S.unsupported} tone="warn" />
              ) : null}
              {reader.status === "unavailable" && reader.reason === "disabled" ? (
                <SecondaryButton label={S.openSettings} onPress={() => void nfcReader.openSettings()} />
              ) : null}
              <CtaButton label={reader.status === "idle" ? S.start : S.reading_again} onPress={() => void read()} />
            </>
          )}
        </View>
      </Card>

      {qrOpen ? (
        <Card>
          <AppText variant="heading">{S.qrTitle}</AppText>
          <AppText variant="caption" tone="muted" style={styles.hint}>
            {S.qrHint}
          </AppText>
          <View style={[styles.qr, { borderRadius: theme.radii.field }]}>
            <DeviceQrScanner active={qrOpen} onCode={onQrCode} onPermissionDenied={() => setQrMessage(S.qrDenied)} />
          </View>
          <ErrorBanner message={qrMessage} tone="warn" />
        </Card>
      ) : (
        <SecondaryButton label={S.qrFallback} onPress={() => setQrOpen(true)} />
      )}
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  actions: { marginTop: 14, gap: 10 },
  hint: { marginTop: 4, marginBottom: 10 },
  qr: { height: QR_HEIGHT, overflow: "hidden", marginBottom: 10 },
});
