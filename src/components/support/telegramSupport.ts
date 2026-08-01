// The public handle supplied by the product owner. It is deliberately only a
// normal Telegram link; a bot token must never be shipped to the browser.
const FALLBACK_TELEGRAM_SUPPORT_URL = "https://t.me/maituandung004";
const TELEGRAM_HOSTS = new Set([
  "t.me",
  "www.t.me",
  "telegram.me",
  "www.telegram.me",
]);

function getSafeTelegramUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return FALLBACK_TELEGRAM_SUPPORT_URL;
  }

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== "https:" ||
      !TELEGRAM_HOSTS.has(url.hostname) ||
      url.pathname === "/"
    ) {
      return FALLBACK_TELEGRAM_SUPPORT_URL;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_TELEGRAM_SUPPORT_URL;
  }
}

// This is a public Telegram link only. Never put a bot token in client code.
export const TELEGRAM_SUPPORT_URL = getSafeTelegramUrl(
  import.meta.env.VITE_TELEGRAM_SUPPORT_URL,
);

export const TELEGRAM_SUPPORT_MESSAGE = `Xin chào đội ngũ MTD Lingo Pro,

Mình cần hỗ trợ về:
- Tài khoản/email:
- Trang hoặc bài học đang gặp vấn đề:
- Thiết bị/trình duyệt:
- Mô tả lỗi:

Mình có thể gửi ảnh chụp màn hình nếu cần. Cảm ơn đội ngũ!`;

export function getTelegramComposeUrl(message: string): string {
  try {
    const url = new URL(TELEGRAM_SUPPORT_URL);
    const trimmedMessage = message.trim();

    if (trimmedMessage) {
      url.searchParams.set("text", trimmedMessage);
    }

    return url.toString();
  } catch {
    return TELEGRAM_SUPPORT_URL;
  }
}

export async function copyTelegramText(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Try the legacy fallback below for browsers that block Clipboard API.
    }
  }

  if (typeof document === "undefined" || !document.body) {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
