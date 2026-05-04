// =========================
// 🔥 FETCH DO SITE
// =========================
export async function fetchSiteContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (RivalWatch Bot)',
      },
    });

    if (!res.ok) {
      throw new Error(`Erro ao acessar ${url}`);
    }

    const html = await res.text();

    return html;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : 'Erro ao buscar site'
    );
  }
}

// =========================
// 🧹 LIMPAR HTML
// =========================
export function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// =========================
// 🔑 HASH (COMPATÍVEL COM BROWSER)
// =========================
export async function generateHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

// =========================
// 🔍 COMPARAR MUDANÇA
// =========================
export function hasChanged(oldHash: string | null, newHash: string): boolean {
  if (!oldHash) return true;
  return oldHash !== newHash;
}

// =========================
// 💰 EXTRAIR PREÇO
// =========================
export function extractPrice(html: string): number | null {
  try {
    // 🔥 padrão BR (R$ 1.234,56)
    const brMatch = html.match(/R\$ ?([\d\.,]+)/);

    if (brMatch) {
      const normalized = brMatch[1]
        .replace(/\./g, '')
        .replace(',', '.');

      return Number(normalized);
    }

    // 🔥 padrão US ($123.45)
    const usMatch = html.match(/\$ ?([\d\.,]+)/);

    if (usMatch) {
      const normalized = usMatch[1].replace(',', '');
      return Number(normalized);
    }

    return null;
  } catch {
    return null;
  }
}

// =========================
// 🚀 PIPELINE COMPLETO
// =========================
export async function processSite(url: string) {
  const raw = await fetchSiteContent(url);

  const cleaned = cleanHtml(raw);

  const hash = await generateHash(cleaned); // 🔥 agora async

  const price = extractPrice(raw);

  return {
    raw,
    cleaned,
    hash,
    price,
  };
}