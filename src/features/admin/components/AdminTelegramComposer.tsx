import { useMemo, useState } from "react";

import {
  copyTelegramText,
  getTelegramComposeUrl,
  TELEGRAM_SUPPORT_MESSAGE,
  TELEGRAM_SUPPORT_URL,
} from "../../../components/support/telegramSupport";

const telegramTemplates = [
  {
    id: "bug",
    label: "Tiếp nhận lỗi học viên",
    message: TELEGRAM_SUPPORT_MESSAGE,
  },
  {
    id: "weekly",
    label: "Báo cáo tuần",
    message:
      "Báo cáo MTD Lingo Pro tuần này:\n- Người dùng mới:\n- Bộ bài được luyện nhiều:\n- Tỷ lệ hoàn thành:\n- Vấn đề cần xử lý:\n- Việc ưu tiên tuần tới:",
  },
  {
    id: "content",
    label: "Đề xuất học liệu",
    message:
      "Đề xuất học liệu mới:\n- Kỹ năng / TOEIC Part:\n- Trình độ:\n- Chủ đề:\n- Dạng bài mong muốn:\n- Số lượng câu dự kiến:\n- Ghi chú:",
  },
  {
    id: "follow-up",
    label: "Theo dõi học viên",
    message:
      "Cần theo dõi học viên:\n- Tên / email:\n- Mục tiêu:\n- Tiến độ hiện tại:\n- Điểm cần hỗ trợ:\n- Hẹn liên hệ lại:",
  },
] as const;

function AdminTelegramComposer() {
  const [selectedTemplateId, setSelectedTemplateId] = useState("bug");
  const [message, setMessage] = useState<string>(telegramTemplates[0].message);
  const [status, setStatus] = useState("");

  const selectedTemplate = useMemo(
    () =>
      telegramTemplates.find(
        (template) => template.id === selectedTemplateId,
      ) ?? telegramTemplates[0],
    [selectedTemplateId],
  );

  const chooseTemplate = (templateId: string) => {
    const template =
      telegramTemplates.find((item) => item.id === templateId) ??
      telegramTemplates[0];
    setSelectedTemplateId(template.id);
    setMessage(template.message);
    setStatus("");
  };

  const copyMessage = () => {
    void copyTelegramText(message).then((copied) => {
      setStatus(
        copied ? "Đã copy nội dung." : "Không thể copy trên trình duyệt này.",
      );
    });
  };

  const openTelegram = () => {
    window.open(
      getTelegramComposeUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
    setStatus(`Đã mở ${TELEGRAM_SUPPORT_URL.replace("https://", "")}.`);
  };

  return (
    <section className="premium-surface mt-6 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.08] via-slate-900/70 to-violet-300/[0.06] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Telegram operations box
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            Soạn nhanh cho @{TELEGRAM_SUPPORT_URL.split("/").pop()}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Chọn mẫu, chỉnh nội dung rồi copy hoặc mở thẳng Telegram. Đây là
            luồng chat thủ công an toàn; gửi thông báo tự động cần bot token và
            chat ID ở server, tuyệt đối không đặt secret trong frontend.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Không lưu token
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Mẫu tin nhắn
          </p>
          {telegramTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => chooseTemplate(template.id)}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm font-bold transition ${
                selectedTemplate.id === template.id
                  ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {template.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setStatus("");
            }}
            className="w-full rounded-xl border border-dashed border-white/10 px-3 py-2 text-xs font-black text-slate-500 transition hover:border-white/20 hover:text-white"
          >
            Xóa để soạn mới
          </button>
        </div>

        <div>
          <label
            htmlFor="admin-telegram-message"
            className="text-xs font-black uppercase tracking-wider text-slate-500"
          >
            Nội dung sẽ gửi
          </label>
          <textarea
            id="admin-telegram-message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setStatus("");
            }}
            rows={9}
            className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
            placeholder="Nhập thông tin cần gửi..."
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-600" aria-live="polite">
              {status || "Tin nhắn không được lưu lên máy chủ."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyMessage}
                className="min-h-10 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-white/10"
              >
                Copy nội dung
              </button>
              <button
                type="button"
                onClick={openTelegram}
                className="min-h-10 rounded-xl bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Mở Telegram →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminTelegramComposer;
