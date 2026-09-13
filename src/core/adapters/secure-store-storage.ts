import * as SecureStore from "expo-secure-store";
import type { SecureStorage } from "@/core/ports/secure-storage";

/** Adaptador de expo-secure-store (Keychain en iOS, Keystore en Android). */
export const secureStoreStorage: SecureStorage = {
  get(key) {
    return SecureStore.getItemAsync(key);
  },
  set(key, value) {
    return SecureStore.setItemAsync(key, value);
  },
  remove(key) {
    return SecureStore.deleteItemAsync(key);
  },
};
