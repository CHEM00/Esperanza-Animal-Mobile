import { NoticeModal, NoticeParagraph } from "./notice-modal";

/**
 * Confirmación de una acción con consecuencias (dar de baja, desvincular,
 * quitar guardián, marcar sospechoso): título, explicación y dos botones. Es
 * el aviso modal con la forma fija de «confirmar o cancelar», para que todas
 * las confirmaciones de la app se vean y se comporten igual.
 */
interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** `warn` para acciones que quitan o desvinculan; `primary` para las de buenas noticias. */
  tone?: "primary" | "warn";
  emblem?: string;
  busy?: boolean;
  error?: string | null;
  testID?: string;
}

export function ConfirmDialog({
  visible,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  tone = "warn",
  emblem,
  busy = false,
  error = null,
  testID,
}: ConfirmDialogProps) {
  return (
    <NoticeModal
      visible={visible}
      title={title}
      tone={tone}
      emblem={emblem}
      primaryLabel={confirmLabel}
      onPrimary={onConfirm}
      secondaryLabel={cancelLabel}
      onSecondary={onCancel}
      busy={busy}
      error={error}
      testID={testID}
    >
      <NoticeParagraph>{body}</NoticeParagraph>
    </NoticeModal>
  );
}
