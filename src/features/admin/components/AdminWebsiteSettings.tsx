import { useEffect, useMemo, useRef, useState } from "react";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { ApiError } from "../../../lib/api/api-client";
import {
  getAdminWebsiteSettingsRequest,
  triggerAdminWebsiteDeployRequest,
  updateAdminWebsiteSettingsRequest,
  type AdminWebsiteSettings as AdminWebsiteSettingsPayload,
} from "../../../lib/api/admin-settings-api";

const PRODUCTION_FRONTEND_URL = "https://english-c0h.pages.dev";
const PRODUCTION_API_URL = "https://english-3t66.onrender.com/api";

const defaultSettings: AdminWebsiteSettingsPayload = {
  frontendUrl: PRODUCTION_FRONTEND_URL,
  apiUrl: PRODUCTION_API_URL,
  buildCommand: "npm run build",
  backendCommand: "cd server && npm run build && npm run start:prod",
};

type StatusNotice = {
  tone: "success" | "error";
  message: string;
};

type AdminWebsiteSettingsProps = {
  runWithSessionRetry: <Result>(
    request: () => Promise<Result>,
  ) => Promise<Result>;
};

function applyProductionUrlDefaults(
  settings: AdminWebsiteSettingsPayload,
): AdminWebsiteSettingsPayload {
  const frontendUrl = settings.frontendUrl.trim();
  const apiUrl = settings.apiUrl.trim();

  return {
    ...settings,
    frontendUrl:
      !frontendUrl || frontendUrl.includes("your-domain.com")
        ? PRODUCTION_FRONTEND_URL
        : frontendUrl,
    apiUrl:
      !apiUrl || apiUrl.includes("your-domain.com")
        ? PRODUCTION_API_URL
        : apiUrl,
  };
}

function getActionErrorMessage(reason: unknown, fallback: string): string {
  return reason instanceof ApiError ? reason.message : fallback;
}

function AdminWebsiteSettingsPanel({
  runWithSessionRetry,
}: AdminWebsiteSettingsProps) {
  const [settings, setSettings] =
    useState<AdminWebsiteSettingsPayload>(defaultSettings);
  const [statusNotice, setStatusNotice] = useState<StatusNotice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployCoolingDown, setIsDeployCoolingDown] = useState(false);
  const deployInFlightRef = useRef(false);
  const deployCooldownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    runWithSessionRetry(getAdminWebsiteSettingsRequest)
      .then((response) => {
        if (!cancelled) setSettings(applyProductionUrlDefaults(response));
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setStatusNotice({
            tone: "error",
            message: getActionErrorMessage(
              reason,
              "Không tải được cấu hình admin.",
            ),
          });
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [runWithSessionRetry]);

  useEffect(
    () => () => {
      if (deployCooldownTimerRef.current !== null) {
        window.clearTimeout(deployCooldownTimerRef.current);
      }
    },
    [],
  );

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

  const updateSetting = (
    key: keyof AdminWebsiteSettingsPayload,
    value: string,
  ) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
    setStatusNotice(null);
  };

  const saveSettings = async () => {
    setStatusNotice(null);

    try {
      const savedSettings = await runWithSessionRetry(() =>
        updateAdminWebsiteSettingsRequest(settings),
      );
      setSettings(applyProductionUrlDefaults(savedSettings));
      setStatusNotice({
        tone: "success",
        message: "Đã lưu cấu hình website lên server.",
      });
    } catch (reason) {
      setStatusNotice({
        tone: "error",
        message: getActionErrorMessage(
          reason,
          "Không thể lưu cấu hình website.",
        ),
      });
    }
  };

  const copyEnv = async () => {
    setStatusNotice(null);

    try {
      await navigator.clipboard.writeText(envPreview);
      setStatusNotice({
        tone: "success",
        message: "Đã copy cấu hình .env.production.",
      });
    } catch {
      setStatusNotice({
        tone: "error",
        message: "Không thể copy cấu hình trên trình duyệt này.",
      });
    }
  };

  const startDeployCooldown = () => {
    setIsDeployCoolingDown(true);

    if (deployCooldownTimerRef.current !== null) {
      window.clearTimeout(deployCooldownTimerRef.current);
    }

    deployCooldownTimerRef.current = window.setTimeout(() => {
      setIsDeployCoolingDown(false);
      deployCooldownTimerRef.current = null;
    }, 60_000);
  };

  const deployWebsite = async () => {
    if (deployInFlightRef.current) return;

    const confirmed = window.confirm(
      `Triển khai bản mới nhất đã được đẩy lên nhánh develop tới ${PRODUCTION_FRONTEND_URL}? Quá trình có thể mất vài phút.`,
    );

    if (!confirmed) return;

    deployInFlightRef.current = true;
    setIsDeploying(true);
    setStatusNotice(null);

    try {
      const result = await runWithSessionRetry(
        triggerAdminWebsiteDeployRequest,
      );

      if (result.accepted) {
        startDeployCooldown();
      }

      setStatusNotice({
        tone: result.accepted ? "success" : "error",
        message: result.accepted
          ? `${result.message} Bản mới nhất trên develop đang được triển khai lên ${PRODUCTION_FRONTEND_URL}.`
          : "Cloudflare Pages chưa chấp nhận yêu cầu triển khai.",
      });
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 429) {
        startDeployCooldown();
      }

      setStatusNotice({
        tone: "error",
        message:
          reason instanceof ApiError && reason.status === 429
            ? "Một yêu cầu triển khai vừa được gửi. Vui lòng đợi một phút trước khi thử lại."
            : getActionErrorMessage(
                reason,
                "Không thể gửi yêu cầu triển khai website.",
              ),
      });
    } finally {
      deployInFlightRef.current = false;
      setIsDeploying(false);
    }
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
          <Button
            type="button"
            size="small"
            onClick={() => void saveSettings()}
          >
            Lưu setting
          </Button>
        </div>
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-slate-500">Đang tải cấu hình...</p>
      )}

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <p className="text-sm font-black text-white">
            Triển khai website production
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
            Cloudflare Pages sẽ lấy bản mới nhất đã được đẩy lên nhánh develop.
            Thông tin xác thực triển khai được giữ an toàn trên backend.
          </p>
        </div>
        <Button
          type="button"
          className="mt-4 shrink-0 sm:mt-0"
          onClick={() => void deployWebsite()}
          isLoading={isDeploying}
          disabled={isLoading || isDeploying || isDeployCoolingDown}
        >
          {isDeployCoolingDown
            ? "Đã gửi — chờ 1 phút"
            : "Triển khai lên english-c0h.pages.dev"}
        </Button>
      </div>

      {statusNotice && (
        <p
          role={statusNotice.tone === "error" ? "alert" : "status"}
          aria-live={statusNotice.tone === "error" ? "assertive" : "polite"}
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            statusNotice.tone === "error"
              ? "border-red-400/25 bg-red-400/10 text-red-300"
              : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {statusNotice.message}
        </p>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Input
          id="admin-frontend-url"
          label="Frontend production URL"
          value={settings.frontendUrl}
          onChange={(event) => updateSetting("frontendUrl", event.target.value)}
          placeholder={PRODUCTION_FRONTEND_URL}
        />
        <Input
          id="admin-api-url"
          label="Backend API production URL"
          value={settings.apiUrl}
          onChange={(event) => updateSetting("apiUrl", event.target.value)}
          placeholder={PRODUCTION_API_URL}
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
    </section>
  );
}

export default AdminWebsiteSettingsPanel;
