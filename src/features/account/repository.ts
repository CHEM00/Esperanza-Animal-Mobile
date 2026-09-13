import { apiClient, call, type ApiClient, type components } from "@/core/api";

export type Me = components["schemas"]["Me"];

export const ME_QUERY_KEY = ["me"] as const;

export function fetchMe(client: ApiClient = apiClient): Promise<Me> {
  return call(() => client.GET("/api/v1/me"));
}
