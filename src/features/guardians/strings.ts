/** Textos de guardianes (M8) y de aceptar enlaces (M9). */
export const GUARDIANS_STRINGS = {
  screen: {
    title: "Guardianes",
    intro: (max: number) =>
      `Todos reciben las alertas de la mascota. Hasta ${max} guardianes además del dueño; solo el dueño transfiere, elimina o desvincula el collar.`,
    role: { DUENO: "Dueño", GUARDIAN: "Guardián" },
    since: (relative: string) => `desde ${relative}`,
    remove: "Quitar",
    leave: "Dejar de ser guardián",
    removeConfirm: {
      title: (name: string) => `¿Quitar a ${name}?`,
      body: "Dejará de recibir las alertas de la mascota. Puedes invitarle de nuevo cuando quieras.",
      confirm: "Quitar",
      cancel: "Cancelar",
    },
    leaveConfirm: {
      title: "¿Dejar de ser guardián?",
      body: "Dejarás de ver a la mascota y de recibir sus alertas.",
      confirm: "Dejar de serlo",
      cancel: "Cancelar",
    },
    invite: {
      action: "Invitar guardián",
      limit: "La mascota ya tiene el máximo de guardianes.",
      title: "Enlace de invitación",
      body: (expires: string) =>
        `Compártelo con la persona que cuidará a tu mascota. Sirve una sola vez y ${expires}.`,
      share: "Compartir enlace",
      copy: "Copiar enlace",
      copied: "Enlace copiado.",
      shareMessage: (petName: string, url: string) => `Te invito a ser guardián de ${petName}: ${url}`,
    },
    transfer: {
      action: "Transferir mascota",
      title: "Transferir a otra persona",
      explain:
        "Quien acepte pasa a ser el dueño y tú quedas como guardián. El enlace sirve una sola vez.",
      body: (expires: string) => `Comparte el enlace con la persona que recibirá a la mascota. Caduca en ${expires}.`,
      share: "Compartir enlace",
      copy: "Copiar enlace",
      cancel: "Cancelar transferencia",
      cancelled: "Transferencia cancelada.",
      pendingExists: "Ya hay una transferencia pendiente. Cancélala para crear otra.",
      shareMessage: (petName: string, url: string) => `Te transfiero a ${petName} en la app: ${url}`,
    },
    ownerOnly: "Solo el dueño invita guardianes y transfiere la mascota.",
  },
  link: {
    invite: {
      title: "Invitación de guardián",
      intro: (petName: string) => `Te invitaron a cuidar a ${petName}.`,
      body: "Como guardián verás su perfil y recibirás sus alertas; el dueño sigue decidiendo sobre el collar.",
      accept: "Aceptar invitación",
      accepted: (petName: string) => `Ya eres guardián de ${petName}.`,
    },
    transfer: {
      title: "Transferencia de mascota",
      intro: (petName: string) => `Te quieren transferir a ${petName}.`,
      body: "Al aceptar pasas a ser el dueño; quien la transfiere queda como guardián.",
      accept: "Aceptar la transferencia",
      accepted: (petName: string) => `${petName} ahora es tuya.`,
    },
    state: {
      usada: "Este enlace ya se usó. Si aún no tienes acceso, pide otro.",
      vencida: "Este enlace caducó. Pide uno nuevo a quien te lo envió.",
    },
    invalid: { title: "Enlace no válido", body: "Este enlace no existe o ya no está disponible." },
    signIn: "Inicia sesión para aceptar con tu cuenta.",
    viewPet: "Ver a la mascota",
    goToPets: "Ir a Mis mascotas",
  },
} as const;
