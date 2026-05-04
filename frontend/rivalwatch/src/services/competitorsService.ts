import puppeteer from 'puppeteer';
import crypto from 'crypto';

// =========================
// 🔥 FETCH REAL (COM BROWSER)
// =========================
export async function fetchWithBrowser(url: string) {
  const browser = await puppeteer.launch({
    headless: true, // ✅ corrigido
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // ✅ vírgula corrigida
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  );

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  const html = await page.content();

  await browser.close();

  return html;
}

// =========================
// 💰 EXTRAIR PREÇO
// =========================
export function extractPrice(html: string): number | null {
  try {
    const patterns = [
      /R\$ ?([\d\.,]+)/g,
      /\$ ?([\d\.,]+)/g,
      /"price":\s*"([\d\.]+)"/g,
      /content="([\d\.]+)"\s*itemprop="price"/g,
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(html);

      if (match) {
        const value = match[1]
          .replace(/\./g, '')
          .replace(',', '.');

        const price = Number(value);

        if (!isNaN(price)) return price;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// =========================
// 🔑 HASH (NODE)
// =========================
export function generateHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// =========================
// 🚀 PIPELINE COMPLETO
// =========================
export async function processSite(url: string) {
  const html = await fetchWithBrowser(url);

  const hash = generateHash(html);

  const price = extractPrice(html);

  return {
    html,
    hash,
    price,
  };
}