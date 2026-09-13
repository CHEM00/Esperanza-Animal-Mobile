import { secureStoreStorage } from "@/core/adapters/secure-store-storage";
import { createSessionStore } from "./session-store";

/** Almacén de sesión del proceso sobre el almacenamiento seguro del dispositivo. */
export const sessionStore = createSessionStore(secureStoreStorage);
