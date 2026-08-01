import { apiRequest } from "./api-client";
import { getStoredAccessToken } from "./session";

export type AdminWebsiteSettings = {
  frontendUrl: string;
  apiUrl: string;
  buildCommand: string;
  backendCommand: string;
};

export type AdminWebsiteDeployResult = {
  accepted: boolean;
  message: string;
  triggeredAt: string;
};

export function getAdminWebsiteSettingsRequest(): Promise<AdminWebsiteSettings> {
  return apiRequest<AdminWebsiteSettings>("/admin/settings/website", {
    accessToken: getStoredAccessToken(),
  });
}

export function updateAdminWebsiteSettingsRequest(
  payload: AdminWebsiteSettings,
): Promise<AdminWebsiteSettings> {
  return apiRequest<AdminWebsiteSettings>("/admin/settings/website", {
    method: "PATCH",
    body: payload,
    accessToken: getStoredAccessToken(),
  });
}

export function triggerAdminWebsiteDeployRequest(): Promise<AdminWebsiteDeployResult> {
  return apiRequest<AdminWebsiteDeployResult>("/admin/settings/deploy", {
    method: "POST",
    accessToken: getStoredAccessToken(),
  });
}
