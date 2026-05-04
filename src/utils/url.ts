export type WebsiteValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function hasProtocol(value: string) {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value);
}

export function normalizeWebsiteInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (hasProtocol(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function validateWebsite(rawOrNormalized: string): WebsiteValidationResult {
  const value = rawOrNormalized.trim();
  if (!value) return { ok: false, error: 'Informe um website.' };

  try {
    const url = new URL(value);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return { ok: false, error: 'Use um link http(s).' };
    }
    if (!url.hostname || !url.hostname.includes('.')) {
      return { ok: false, error: 'Website inválido. Ex: https://exemplo.com' };
    }

    return { ok: true, url: url.toString() };
  } catch {
    return { ok: false, error: 'Website inválido. Ex: https://exemplo.com' };
  }
}

export function normalizeAndValidateWebsite(raw: string): WebsiteValidationResult {
  const normalized = normalizeWebsiteInput(raw);
  return validateWebsite(normalized);
}

