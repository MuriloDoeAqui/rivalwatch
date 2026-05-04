import { supabase } from './supabaseClient';
import { processSite } from './monitorService';

// =========================
// 🔍 PEGAR ÚLTIMO PREÇO
// =========================
async function getLastPrice(siteId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('price_logs')
    .select('price')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar último preço:', error.message);
    return null;
  }

  return data?.price ?? null;
}

// =========================
// 💾 SALVAR PREÇO
// =========================
async function savePrice(siteId: string, price: number) {
  const { error } = await supabase.from('price_logs').insert({
    site_id: siteId,
    price,
  });

  if (error) {
    console.error('Erro ao salvar preço:', error.message);
  }
}

// =========================
// 🚨 DETECTAR MUDANÇA
// =========================
function detectChange(oldPrice: number | null, newPrice: number) {
  if (oldPrice === null) {
    return {
      changed: true,
      type: 'novo',
    };
  }

  if (newPrice > oldPrice) {
    return {
      changed: true,
      type: 'subiu',
      diff: newPrice - oldPrice,
    };
  }

  if (newPrice < oldPrice) {
    return {
      changed: true,
      type: 'caiu',
      diff: oldPrice - newPrice,
    };
  }

  return {
    changed: false,
      type: 'igual',
  };
}

// =========================
// 🔥 MONITORAR UM SITE
// =========================
export async function monitorSite(site: {
  id: string;
  url: string;
  name?: string;
}) {
  try {
    const result = await processSite(site.url);

    if (!result.price) {
      console.log('⚠️ Preço não encontrado:', site.url);
      return;
    }

    const lastPrice = await getLastPrice(site.id);

    const change = detectChange(lastPrice, result.price);

    // 🔥 salva sempre (histórico)
    await savePrice(site.id, result.price);

    // 🔥 LOG INTELIGENTE
    if (change.changed) {
      console.log('💥 MUDANÇA DETECTADA!');
      console.log('Site:', site.name || site.url);
      console.log('Antes:', lastPrice);
      console.log('Agora:', result.price);
      console.log('Tipo:', change.type);
    } else {
      console.log('✔ Sem mudança:', site.url);
    }

  } catch (err) {
    console.error('Erro monitorando:', site.url);
  }
}

// =========================
// 🚀 MONITORAR TODOS
// =========================
export async function runMonitor() {
  const { data: sites, error } = await supabase
    .from('sites')
    .select('*');

  if (error) {
    console.error('Erro ao buscar sites:', error.message);
    return;
  }

  for (const site of sites || []) {
    await monitorSite(site);
  }

  console.log('✅ Monitoramento finalizado');
}