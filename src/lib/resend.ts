import { Resend } from "resend";

// Lazy singleton — only instantiated when first used at runtime, not at build time
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return _resend;
}
