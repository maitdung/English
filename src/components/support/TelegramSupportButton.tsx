import { TELEGRAM_SUPPORT_URL } from "./telegramSupport";

type TelegramSupportButtonProps = {
  label?: string;
  variant?: "floating" | "inline";
};

function TelegramSupportButton({
  label = "Hỗ trợ Telegram",
  variant = "floating",
}: TelegramSupportButtonProps) {
  const isFloating = variant === "floating";

  return (
    <a
      href={TELEGRAM_SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (mở trong tab mới)`}
      title={label}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isFloating
          ? "fixed bottom-5 right-5 z-40 min-h-12 border-cyan-300/30 bg-cyan-400 px-4 py-3 text-sm text-slate-950 shadow-2xl shadow-cyan-950/40 sm:bottom-7 sm:right-7"
          : "min-h-10 border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-400/20"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
      >
        <path d="M21.9 2.6 2.8 9.9c-.8.3-.8 1.4 0 1.7l5.1 1.9 1.9 5.1c.3.8 1.4.8 1.7 0l7.3-19.1c.3-.8-.5-1.6-1.3-1.3ZM9.2 12.6 5.6 11.3l11.5-4.4-7.9 5.7Zm1.7 3.4-1.2-3.6 5.7-7.9-4.5 11.5Z" />
      </svg>
      <span>{label}</span>
    </a>
  );
}

export default TelegramSupportButton;
