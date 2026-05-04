# 🎯 RivalWatch Worker - Resumo de Correções

## Problemas Identificados e Corrigidos

### ❌ Problema 1: Package.json Incorreto
**Causa:** Railway não conseguia detectar o comando start
- ❌ Faltava: `"start": "node worker.js"`
- ❌ `"type": "commonjs"` conflitava com ES Modules

**✅ Solução:**
```json
{
  "scripts": {
    "start": "node worker.js",
    "dev": "node worker.js",
    "check": "node check-config.js"
  },
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

### ❌ Problema 2: Variáveis de Ambiente Erradas
**Causa:** 
- `.env` usava `SUPABASE_ANON_KEY` (chave pública)
- `worker.js` tentava ler `SUPABASE_KEY` (chave secreta)
- Não havia validação das variáveis no startup

**✅ Solução:**
- ✅ Validação de variáveis obrigatórias no inicialização
- ✅ `.env` agora com variáveis corretas
- ✅ Mensagens de erro claras se faltarem ENV vars

```javascript
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
if (missingEnvVars.length > 0) {
  console.error('❌ ERRO CRÍTICO: Variáveis faltando:', missingEnvVars.join(', '));
  process.exit(1);
}
```

---

### ❌ Problema 3: Puppeteer Instável
**Causa:** 
- Sem retry logic
- Timeout muito longo (60s) causava travamentos
- Sem `--disable-dev-shm-usage` (problema em Railway)

**✅ Solução:**
```javascript
async function scrape(url, retries = 2) {
  // Tenta 3 vezes antes de falhar
  for (let attempt = 0; attempt <= retries; attempt++) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'  // ← NOVO
      ],
    });
    // ... tenta scraping
    // Se falhar, aguarda 2s e tenta novamente
  }
}
```

---

### ❌ Problema 4: Tratamento de Erros Fraco
**Causa:** Worker podia crashar silenciosamente sem reiniciar

**✅ Solução:**
```javascript
// Captura exceções não tratadas
process.on('uncaughtException', (err) => {
  console.error('❌ EXCEÇÃO:', err);
  // Reinicia após 5 segundos em vez de falhar
  setTimeout(start, 5000);
});

// Captura promises rejeitadas
process.on('unhandledRejection', (reason) => {
  console.error('❌ PROMISE REJEITADA:', reason);
  // Continua rodando
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Encerrando gracefully...');
  process.exit(0);
});
```

---

### ❌ Problema 5: Falta de Procfile
**Causa:** Railway não sabia o tipo de serviço

**✅ Solução:**
- ✅ Criado `Procfile` com: `worker: node worker.js`

---

### ❌ Problema 6: Logs Deficientes
**Causa:** Difícil debugar problemas em produção

**✅ Solução:**
- ✅ Logs com timestamp
- ✅ Counters de sucesso/falha
- ✅ Mensagens de erro mais descritivas
- ✅ Status de cada site monitorado

---

## 📁 Arquivos Modificados/Criados

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `package.json` | ✅ CORRIGIDO | Script start, type: module, engines |
| `worker.js` | ✅ CORRIGIDO | Retry logic, tratamento de erros, graceful shutdown |
| `.env` | ✅ CORRIGIDO | Variáveis com nomes corretos |
| `Procfile` | ✅ NOVO | Configuração para Railway |
| `.env.example` | ✅ NOVO | Template para variáveis |
| `.npmrc` | ✅ NOVO | Configuração npm |
| `.railwayignore` | ✅ NOVO | Arquivos a ignorar no deploy |
| `check-config.js` | ✅ NOVO | Script de validação pré-deploy |
| `postinstall.js` | ✅ NOVO | Mensagem pós-instalação |
| `README.md` | ✅ NOVO | Documentação completa |
| `RAILWAY_DEPLOYMENT.md` | ✅ NOVO | Guia passo a passo Railway |

---

## 🚀 Próximos Passos

### 1️⃣ Testara Localmente
```bash
cd worker
npm install
npm run check    # Verifica configuração
npm start        # Inicia worker
```

### 2️⃣ Fazer Commit
```bash
git add .
git commit -m "fix: configuração worker para Railway"
git push origin main
```

### 3️⃣ Configurar na Railway
1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Configure variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (chave SECRETA, não anon key)
4. Deploy automático iniciará

### 4️⃣ Monitorar
- Vá para Railway > Logs
- Procure por mensagens de sucesso: `🚀 Worker iniciado com sucesso!`

---

## 🔍 Checklist de Validação

- [x] ✅ Package.json tem `"start": "node worker.js"`
- [x] ✅ Package.json tem `"type": "module"`
- [x] ✅ Variáveis de ambiente validadas no startup
- [x] ✅ Retry logic implementada
- [x] ✅ Graceful shutdown configurado
- [x] ✅ Procfile criado
- [x] ✅ Logs melhorados
- [x] ✅ Documentação completa
- [x] ✅ Script de validação pré-deploy

---

## 📊 Melhorias Implementadas

| Métrica | Antes | Depois |
|---------|-------|--------|
| **Startup Detection** | ❌ Falhava | ✅ Automático |
| **Error Handling** | ⚠️ Fraco | ✅ Robusto |
| **Retry Logic** | ❌ Nenhuma | ✅ 3 tentativas |
| **Graceful Shutdown** | ❌ Nenhum | ✅ SIGTERM/SIGINT |
| **Logs** | ⚠️ Mínimos | ✅ Detalhados |
| **Env Validation** | ❌ Nenhuma | ✅ Validado |
| **Documentation** | ❌ Nenhuma | ✅ Completa |
| **Railway Ready** | ❌ Não | ✅ Sim |

---

## 🎓 Estrutura Final do Projeto

```
worker/
├── .env                    # Variáveis de ambiente (GITIGNORE)
├── .env.example           # Template (commitar)
├── .npmrc                 # Config npm
├── .railwayignore         # Ignore list para Railway
├── package.json           # ✅ CORRIGIDO
├── worker.js              # ✅ CORRIGIDO
├── check-config.js        # ✅ NOVO
├── postinstall.js         # ✅ NOVO
├── Procfile               # ✅ NOVO
├── README.md              # ✅ NOVO
├── RAILWAY_DEPLOYMENT.md  # ✅ NOVO
└── node_modules/          # Instalado
```

---

## ⚠️ Pontos Críticos

1. **SUPABASE_KEY deve ser a chave SECRETA!**
   - ❌ Usar SUPABASE_ANON_KEY não funciona
   - ✅ Use: Settings > API > service_role secret

2. **Commit `.env` NUNCA!**
   - Use `.env` para desenvolvimento local apenas
   - Railway lê variáveis do painel

3. **Teste localmente ANTES de fazer push**
   ```bash
   npm run check  # Verifica env
   npm start      # Testa worker
   ```

---

## 🆘 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "No start command detected" | ✅ Commit package.json e Procfile |
| "SUPABASE_KEY: NÃO CONFIGURADO" | ✅ Adicione no painel Railway |
| Worker crashando | ✅ Verifique logs: `railway logs --follow` |
| Preço não encontrado | ✅ Atualize regex em `extractPrice()` |
| Memória insuficiente | ✅ Aumente RAM no Railway ou reduza intervalo |

---

✅ **Tudo pronto! Seu worker deve funcionar perfeitamente na Railway agora.**
