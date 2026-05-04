# 🔧 Guia Avançado: Otimização e Troubleshooting

## 📊 Monitoramento Avançado

### Logs em Diferentes Ambientes

#### Local
```bash
npm start
# Vê logs em tempo real no terminal
```

#### Railway
```bash
# Terminal
railway logs --follow

# ou Web Dashboard
1. railway.app > Seu projeto
2. Logs tab
3. Vê output em tempo real
```

### Métricas Importantes

#### Tempo de Ciclo
- **Esperado:** 5-15 minutos (depende do número de sites)
- **Fórmula:** 10 min base + (N sites × 2 seg) + overhead

```
Ex: 10 sites
= 10 min + (10 × 2 seg) = 10 min 20 seg
```

#### Taxa de Sucesso
Procure no log:
```
✅ Ciclo finalizado - Sucesso: 8, Falhas: 2
```

- **Esperado:** > 70% de sucesso
- **Se < 50%:** Aumentar retries ou revisar regex

#### Uso de Memória
```bash
# Railway Dashboard
Serviço > Resources
Monitorar RAM usage
```

- **Esperado:** 200-400 MB
- **Se > 800 MB:** Problema de memory leak
- **Solução:** Aumentar `--disable-dev-shm-usage` ou reduza sites/ciclo

---

## 🔍 Troubleshooting Avançado

### Erro: "Timeout no Puppeteer"

**Sintomas:**
```
⚠️ Tentativa 1 falhou para URL: TimeoutError: Timeout waiting for page
```

**Causas:**
1. Site muito lento
2. Puppeteer timeout muito curto
3. Conexão instável

**Soluções:**

```javascript
// Aumentar timeout (worker.js)
await page.goto(url, {
  waitUntil: 'domcontentloaded',
  timeout: 60000,  // ← Mude para 60 segundos
});

page.setDefaultNavigationTimeout(60000);  // ← Adicione
```

Depois: commit, push, Railway redeploy

### Erro: "Preço não encontrado"

**Sintomas:**
```
🔍 Verificando: https://exemplo.com
⚠️ Preço não encontrado para este site
```

**Causas:**
1. Regex não corresponde ao site
2. Site mudou sua estrutura HTML
3. JavaScript necessário não carregou

**Soluções:**

**Opção 1: Revisar regex (worker.js)**
```javascript
function extractPrice(html) {
  const patterns = [
    /R\$ ?([\d\.,]+)/,
    /\$ ?([\d\.,]+)/,
    /class="a-offscreen">([\d\.,]+)/,
    /seu_novo_padrão/,  // ← Adicione aqui
  ];
  // ...
}
```

**Opção 2: Debugar localmente**
```bash
npm start
# Procure pelos logs do site específico
# Vá ao site manualmente e inspecione o HTML
```

**Opção 3: Usar waitForSelector se precisar JS**
```javascript
// Se o site precisa de JavaScript carregar
await page.waitForSelector('.preco', { timeout: 30000 });
const html = await page.content();
```

### Erro: "Memória insuficiente"

**Sintomas:**
```
FATAL ERROR: ... out of memory
```

**Causas:**
1. Muitos sites por ciclo
2. Browser não fechando
3. Memory leak no código

**Soluções:**

**Opção 1: Aumentar RAM na Railway**
```
1. Railway Dashboard > Projeto > Serviço
2. Resources
3. Selecione plano com mais RAM
```

**Opção 2: Reduzir sites por ciclo**
```javascript
// Fazer 2 ciclos em vez de 1 por hora
setTimeout(start, 5 * 60 * 1000);  // ← Mude para 5 min
```

**Opção 3: Monitorar browser close**
```javascript
// Certifique-se que `await browser.close()` está sendo chamado
// Check: worker.js linha ~80
```

### Erro: "Railway segue retendo o serviço"

**Sintomas:**
- Worker inicia mas para depois de poucos minutos
- Logs param de repente

**Causas:**
1. Crash não tratado
2. Memory limit atingido
3. Process.exit() sendo chamado

**Soluções:**

Verifique logs:
```bash
railway logs --follow
```

Se vir:
- `uncaughtException` → Adicionar tratamento
- `out of memory` → Aumentar RAM
- `process exited with code 1` → Verificar logs de erro

---

## 🚀 Performance Tunning

### Otimizar Scraping

**Reduzir tempo de carregamento:**
```javascript
// Disable imagens e CSS (economiza bandwidth)
await page.setResourceType('image', false);
await page.setResourceType('stylesheet', false);

// Ou usar:
await page.setRequestInterception(true);
page.on('request', (req) => {
  if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
    req.abort();
  } else {
    req.continue();
  }
});
```

**Parallelizar sites:**
```javascript
// Em vez de processar 1 por vez
for (const site of sites) {
  // ... atual
}

// Processar em paralelo (cuidado com memória!)
await Promise.all(sites.map(site => processSite(site)));
```

### Reduzir Custos na Railway

1. **Diminuir intervalo quando possível:**
   - De 10 min → 30 min (reduz consumo 3x)
   
2. **Limitar quantidade de sites:**
   - Máximo ~50 sites por ciclo
   - Se mais, dividir em múltiplas instâncias

3. **Usar plano appropriado:**
   - Free ($5/mês) normalmente OK
   - Pro ($20/mês) se precisa de garantias

---

## 🐛 Debug Avançado

### Ativar Logs Detalhados

```javascript
// worker.js - no início
process.env.DEBUG = 'puppeteer:*';
// Ou
import debug from 'debug';
const log = debug('worker');
log('mensagem');
```

### Capturar Erros Específicos

```javascript
// Adicionar ao worker.js
try {
  const price = await scrape(site.url);
} catch (err) {
  console.error('Erro específico:', {
    url: site.url,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
}
```

### Local vs Production

**Teste localmente:**
```bash
# Ativa modo debug
DEBUG=* npm start
```

**Veja reproduzir no Railway:**
```bash
# Check logs com Railway CLI
railway logs --follow | grep "sua_url"
```

---

## 🔐 Segurança Avançada

### Rate Limiting nos Sites

```javascript
// Aguardar entre requisições
async function scrapeWithRateLimit(sites) {
  for (const site of sites) {
    await scrape(site.url);
    
    // Random delay 1-3 segundos
    const delay = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
```

### User-Agent Rotation

```javascript
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
];

const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
await page.setUserAgent(randomUA);
```

### Detectar Bloqueios

```javascript
async function scrape(url) {
  // ... código
  
  // Verificar se foi bloqueado
  if (html.includes('Access Denied') || html.includes('403')) {
    console.warn(`⚠️ Bloqueado em: ${url}`);
    return null;
  }
}
```

---

## 📈 Escalar para Produção

### Quando Precisa de Mais?

**Sinais:**
- Ciclo levando > 30 minutos
- Taxa de sucesso < 50%
- Memory usage > 70%

**Soluções:**

1. **Múltiplas instâncias Worker:**
   ```
   Worker 1: sites 1-25
   Worker 2: sites 26-50
   Worker 3: sites 51+
   ```

2. **Queue system (fila):**
   - Usar Redis ou similar
   - Worker pega jobs da fila

3. **Scheduled jobs melhorados:**
   - Usar Railway cron
   - Ou AWS Lambda

### Exemplo: Railway Cron

```json
{
  "triggers": [
    {
      "type": "cron",
      "expression": "*/10 * * * *"
    }
  ]
}
```

---

## 📞 Checklist Troubleshooting

Se algo dá errado:

- [ ] Verifique os logs primeiro: `railway logs --follow`
- [ ] Procure por mensagens de erro específicas
- [ ] Teste localmente: `npm start`
- [ ] Verifique variáveis de ambiente no Railway
- [ ] Certifique-se que Supabase está acessível
- [ ] Aumente timeouts se necessário
- [ ] Revise regex de extração de preço
- [ ] Monitore memória e CPU
- [ ] Consulte `README.md` ou `RAILWAY_DEPLOYMENT.md`

---

## 📚 Recursos Úteis

- [Puppeteer Docs](https://pptr.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-implementation-for-http-servers/)

---

✅ **Parabéns! Você tem tudo que precisa para troubleshoot! 🎉**
