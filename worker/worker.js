import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL e SUPABASE_KEY são obrigatórios');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =========================
// 🔥 FETCH COM BROWSER
// =========================
async function fetchWithBrowser(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
function extractPrice(html) {
  const patterns = [
    /R\$ ?([\d\.,]+)/g,
    /\$ ?([\d\.,]+)/g,
    /"price":\s*"([\d\.]+)"/g,
    /content="([\d\.]+)"\s*itemprop="price"/g,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match) {
      const value = match[1].replace(/\./g, '').replace(',', '.');
      const price = parseFloat(value);
      if (!isNaN(price)) return price;
    }
  }
  return null;
}

// =========================
// 🔄 SCRAPE SITE
// =========================
async function scrapeSite(url) {
  try {
    console.log(`🔍 Scraping: ${url}`);
    const html = await fetchWithBrowser(url);
    const price = extractPrice(html);

    if (price) {
      console.log(`✅ Preço encontrado: R$ ${price}`);
      return price;
    } else {
      console.log(`❌ Preço não encontrado`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro ao scrapear ${url}:`, error.message);
    return null;
  }
}

// =========================
// 💾 SALVAR PREÇO
// =========================
async function savePrice(siteId, price) {
  try {
    const { error } = await supabase
      .from('price_logs')
      .insert({
        site_id: siteId,
        price: price,
        scraped_at: new Date().toISOString(),
      });

    if (error) throw error;
    console.log(`💾 Preço salvo: ${price} para site ${siteId}`);
  } catch (error) {
    console.error('❌ Erro ao salvar preço:', error);
  }
}

// =========================
// 🚀 LOOP PRINCIPAL
// =========================
async function scrapeAllSites() {
  try {
    console.log('🚀 Iniciando scraping...');

    // Buscar todos os sites
    const { data: sites, error } = await supabase
      .from('sites')
      .select('id, url, name');

    if (error) throw error;

    console.log(`📋 Encontrados ${sites.length} sites para monitorar`);

    // Scrapear cada site
    for (const site of sites) {
      const price = await scrapeSite(site.url);
      if (price) {
        await savePrice(site.id, price);
      }
      // Pequena pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('✅ Ciclo de scraping concluído');
  } catch (error) {
    console.error('❌ Erro no scraping:', error);
  }
}

// =========================
// 🎯 START WORKER
// =========================
async function start() {
  console.log('🤖 RivalWatch Worker iniciado');

  // Loop infinito a cada 10 minutos
  while (true) {
    await scrapeAllSites();

    console.log('⏰ Aguardando 10 minutos...');
    await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000));
  }
}

// =========================
// 🛑 GRACEFUL SHUTDOWN
// =========================
process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, encerrando...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, encerrando...');
  process.exit(0);
});

// Iniciar worker
start().catch(console.error);