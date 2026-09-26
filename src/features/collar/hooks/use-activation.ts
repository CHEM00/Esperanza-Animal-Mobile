import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { appConfig } from "@/core/config";
import { nfcReader } from "@/core/device";
import { messageForError } from "@/core/errors/problem-messages";
import { hrefForDeepLink, resolveDeepLink } from "@/core/navigation/links";
import { PETS_QUERY_KEYS } from "@/features/pets/constants";
import { usePets } from "@/features/pets/hooks/use-pets";
import {
  activationReducer,
  initialActivationState,
  isPetEligibleForCollar,
  isScanExpired,
} from "../activation/activation-machine";
import { activateTag, resolveNfcScan } from "../repository";
import { parseScanUrl } from "../scan-url";
import { COLLAR_STRINGS } from "../strings";

/**
 * Caso de uso de activación (M4, RF-E3): lee el chip con el puerto NFC, lo
 * verifica en el servidor, deja elegir la mascota y vincula. La máquina de
 * estados decide; aquí solo se conectan dispositivo, red y temporizador.
 */
export interface InitialScan {
  token: string;
  expiresAt: string;
}

export function useActivation(preselectedPetId: string | null, initialScan: InitialScan | null = null) {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(activationReducer, preselectedPetId, initialActivationState);

  /** Llegada por enlace universal: la lectura ya está verificada, no se repite. */
  useEffect(() => {
    if (initialScan) {
      dispatch({ type: "START_READ" });
      dispatch({
        type: "RESOLVED",
        resolution: { view: "ACTIVATION", tagStatus: "LISTO", scanToken: initialScan.token, expiresAt: initialScan.expiresAt },
      });
    }
    // Solo al montar: el enlace no cambia mientras la pantalla vive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pets = usePets();
  const eligiblePets = useMemo(() => (pets.data ?? []).filter(isPetEligibleForCollar), [pets.data]);
  const domains = useMemo(() => ({ linkDomain: appConfig.linkDomain, scheme: appConfig.scheme }), []);

  const activation = useMutation({
    mutationFn: (input: { scanToken: string; petId: string }) => activateTag(input),
    onSuccess: (tag) => {
      dispatch({ type: "ACTIVATED", tag });
      return queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.all });
    },
    onError: (error) => dispatch({ type: "ACTIVATION_FAILED", message: messageForError(error) }),
  });

  const startRead = useCallback(async () => {
    dispatch({ type: "START_READ" });
    const read = await nfcReader.readUrl({ prompt: COLLAR_STRINGS.scan.prompt });
    switch (read.status) {
      case "cancelled":
        dispatch({ type: "READ_CANCELLED" });
        return;
      case "unavailable":
        dispatch({ type: "READ_UNAVAILABLE", reason: read.reason });
        return;
      case "not_url":
        dispatch({ type: "READ_NOT_COLLAR" });
        return;
      case "failed":
        dispatch({ type: "READ_FAILED", message: read.message });
        return;
      case "url": {
        const parsed = parseScanUrl(read.url, domains, (url) => {
          const link = resolveDeepLink(url, domains);
          return link ? hrefForDeepLink(link) : null;
        });
        if (parsed.kind !== "nfc") {
          dispatch({ type: "READ_NOT_COLLAR" });
          return;
        }
        try {
          const resolution = await resolveNfcScan({ p: parsed.p, m: parsed.m });
          dispatch({ type: "RESOLVED", resolution });
        } catch (error) {
          dispatch({ type: "READ_FAILED", message: messageForError(error) });
        }
      }
    }
  }, [domains]);

  const cancelRead = useCallback(async () => {
    await nfcReader.cancel();
    dispatch({ type: "READ_CANCELLED" });
  }, []);

  const pickPet = useCallback((petId: string) => dispatch({ type: "PICK_PET", petId }), []);

  const activate = useCallback(() => {
    if (state.step !== "resolved" || !state.petId) {
      return;
    }
    if (isScanExpired(state.expiresAt)) {
      dispatch({ type: "EXPIRED" });
      return;
    }
    dispatch({ type: "ACTIVATE" });
    activation.mutate({ scanToken: state.scanToken, petId: state.petId });
  }, [activation, state]);

  /** Con mascota preseleccionada, la lectura verificada vincula sin paso intermedio. */
  useEffect(() => {
    if (state.step === "resolved" && state.petId && preselectedPetId && state.error === null) {
      activate();
    }
    // Solo al entrar en «resolved» con preselección; `activate` cambia con el estado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  /** Caducidad del token de escaneo: se despacha en el instante exacto. */
  useEffect(() => {
    if (state.step !== "resolved") {
      return;
    }
    const remaining = new Date(state.expiresAt).getTime() - Date.now();
    if (remaining <= 0) {
      dispatch({ type: "EXPIRED" });
      return;
    }
    const timer = setTimeout(() => dispatch({ type: "EXPIRED" }), remaining);
    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    return () => {
      void nfcReader.cancel();
    };
  }, []);

  return {
    state,
    pets,
    eligiblePets,
    startRead,
    cancelRead,
    pickPet,
    activate,
    reset: () => dispatch({ type: "RESET" }),
    openNfcSettings: () => nfcReader.openSettings(),
  };
}
