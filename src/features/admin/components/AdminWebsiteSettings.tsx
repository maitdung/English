import { useMemo, useState } from "react";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";

const STORAGE_KEY = "mtd-lingo-admin-website-settings";

type WebsiteSettings = {
  frontendUrl: string;
  apiUrl: string;
  buildCommand: string;
  backendCommand: string;
};

const defaultSettings: WebsiteSettings = {
  frontendUrl: "https://your-domain.com",
  apiUrl: "https://api.your-domain.com/api",
  buildCommand: "npm run build",
  backendCommand: "cd server && npm run build && npm run start:prod",
};

function readSettings(): WebsiteSettings {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...(JSON.parse(rawValue) as Partial<WebsiteSettings>),
    };
  } catch {
    return defaultSettings;
  }
}

function AdminWebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(readSettings);
  const [statusMessage, setStatusMessage] = useState("");

  const envPreview = useMemo(
    () => `VITE_API_URL=${settings.apiUrl.replace(/\/$/, "")}`,
    [settings.apiUrl],
  );

  const checklist = [
    ["Build frontend", settings.buildCommand],
    ["Configure API URL", envPreview],
    ["Deploy backend", settings.backendCommand],
    ["Run DB migrations", "cd server && npx prisma migrate deploy"],
    ["Verify health", `${settings.apiUrl.replace(/\/api$/, "")}/api/health`],
  ];

  const updateSetting = (key: keyof WebsiteSettings, value: string) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
    setStatusMessage("");
  };

  const saveSettings = async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setStatusMessage("Đã lưu cấu hình upload website trên thiết bị này.");
  };

  const copyEnv = async () => {
    await navigator.clipboard.writeText(envPreview);
    setStatusMessage("Đã copy cấu hình .env.production.");
  };

  return (
    <section className="premium-surface mt-6 rounded-3xl border border-white/10 bg-slate-900/65 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Website settings
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            Cấu hình thuận tiện khi upload website
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Lưu thông tin môi trường production, lệnh build và checklist để
            deploy không bị thiếu bước.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={copyEnv}
          >
            Copy .env
          </Button>
          <Button type="button" size="small" onClick={saveSettings}>
            Lưu setting
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Input
          id="admin-frontend-url"
          label="Frontend production URL"
          value={settings.frontendUrl}
          onChange={(event) => updateSetting("frontendUrl", event.target.value)}
          placeholder="https://your-domain.com"
        />
        <Input
          id="admin-api-url"
          label="Backend API production URL"
          value={settings.apiUrl}
          onChange={(event) => updateSetting("apiUrl", event.target.value)}
          placeholder="https://api.your-domain.com/api"
        />
        <Input
          id="admin-build-command"
          label="Frontend build command"
          value={settings.buildCommand}
          onChange={(event) =>
            updateSetting("buildCommand", event.target.value)
          }
        />
        <Input
          id="admin-backend-command"
          label="Backend production command"
          value={settings.backendCommand}
          onChange={(event) =>
            updateSetting("backendCommand", event.target.value)
          }
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
            .env.production
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950/70 p-4 text-xs font-bold leading-6 text-cyan-100">
            {envPreview}
          </pre>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Deploy checklist
          </p>
          <div className="mt-3 space-y-2">
            {checklist.map(([label, command]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2"
              >
                <p className="text-xs font-black text-white">{label}</p>
                <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                  {command}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {statusMessage && (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
          {statusMessage}
        </p>
      )}
    </section>
  );
}

export default AdminWebsiteSettings;
