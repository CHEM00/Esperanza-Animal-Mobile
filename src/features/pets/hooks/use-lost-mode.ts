import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useReducer, useState } from "react";
import { messageForError } from "@/core/errors/problem-messages";
import { locationProvider } from "@/core/device";
import { useMe } from "@/features/account/use-me";
import { useRemoteConfig } from "@/features/config/use-remote-config";
import { PETS_QUERY_KEYS } from "../constants";
import {
  buildLostModeSchema,
  initialLostModeState,
  lostModeErrorsOf,
  lostModeReducer,
  toLostModeInput,
  type LostModeErrors,
  type LostModeFormValues,
} from "../lost-mode/lost-mode-machine";
import { activateLostMode } from "../repository";
import { PETS_STRINGS } from "../strings";

/**
 * Caso de uso del modo perdido (M10): une la máquina de estados con la
 * validación remota, la ubicación del dispositivo y la mutación. La pantalla
 * solo pinta `state.step` y llama a estas acciones.
 */
export function useLostMode(petId: string) {
  const queryClient = useQueryClient();
  const remoteConfig = useRemoteConfig();
  const me = useMe();
  const defaults = useMemo<Partial<LostModeFormValues>>(
    () => ({ phone: me.data?.profile?.contact.phone ?? "" }),
    [me.data?.profile?.contact.phone],
  );
  const [state, dispatch] = useReducer(lostModeReducer, defaults, initialLostModeState);
  const [errors, setErrors] = useState<LostModeErrors>({});
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const schema = useMemo(
    () => (remoteConfig.data ? buildLostModeSchema(remoteConfig.data.limits) : null),
    [remoteConfig.data],
  );

  const submitMutation = useMutation({
    mutationFn: (input: ReturnType<typeof toLostModeInput>) => activateLostMode(petId, input),
    onSuccess: (result) => {
      dispatch({ type: "SUBMIT_OK", result });
      return queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.all });
    },
    onError: (error) => dispatch({ type: "SUBMIT_FAIL", message: messageForError(error) }),
  });

  const edit = useCallback((patch: Partial<LostModeFormValues>) => {
    dispatch({ type: "EDIT", patch });
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof LostModeFormValues)[]) {
        if (key in next) {
          delete next[key as keyof LostModeErrors];
        }
      }
      return next;
    });
  }, []);

  /** Valida con los límites remotos y avanza a la responsiva solo si todo está bien. */
  const continueToResponsiva = useCallback(() => {
    if (!schema) {
      return;
    }
    const parsed = schema.safeParse(state.form);
    if (!parsed.success) {
      setErrors(lostModeErrorsOf(parsed.error));
      return;
    }
    setErrors({});
    dispatch({ type: "CONTINUE" });
  }, [schema, state.form]);

  const submit = useCallback(() => {
    if (!schema || state.step !== "responsiva") {
      return;
    }
    const parsed = schema.safeParse(state.form);
    if (!parsed.success) {
      setErrors(lostModeErrorsOf(parsed.error));
      dispatch({ type: "BACK" });
      return;
    }
    dispatch({ type: "SUBMIT" });
    submitMutation.mutate(toLostModeInput(parsed.data));
  }, [schema, state.form, state.step, submitMutation]);

  /** El GPS solo sugiere: centra el pin y la persona lo confirma o lo mueve. */
  const useMyLocation = useCallback(async () => {
    setLocating(true);
    setLocationMessage(null);
    try {
      const result = await locationProvider.getCurrentPosition();
      if (result.status === "ok") {
        edit({ point: result.point });
      } else {
        setLocationMessage(PETS_STRINGS.lostMode.form.point.denied);
      }
    } finally {
      setLocating(false);
    }
  }, [edit]);

  return {
    state,
    errors,
    limits: remoteConfig.data?.limits ?? null,
    mapDefaults: remoteConfig.data?.map ?? null,
    acceptNotice: () => dispatch({ type: "ACCEPT_NOTICE" }),
    edit,
    continueToResponsiva,
    back: () => dispatch({ type: "BACK" }),
    submit,
    reset: () => dispatch({ type: "RESET" }),
    useMyLocation,
    locating,
    locationMessage,
  };
}
