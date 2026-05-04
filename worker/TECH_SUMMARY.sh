#!/usr/bin/env bash
# 📋 RESUMO TÉCNICO - RivalWatch Worker

# ============================================================
# 🎯 OBJETIVO: Scraping de preços com Node.js + Puppeteer
# Deploy: Railway (CI/CD automático)
# Database: Supabase (PostgreSQL)
# ============================================================

# ============================================================
# 📊 MUDANÇAS PRINCIPAIS
# ============================================================

# 1. PACKAGE.JSON
#    ❌ Antes: "type": "commonjs" → ✅ Depois: "type": "module"
#    ❌ Antes: Sem start script → ✅ Depois: "start": "node worker.js"
#    ❌ Antes: main: index.js → ✅ Depois: main: worker.js

# 2. WORKER.JS
#    ✅ Adicionado validação de env vars no startup
#    ✅ Implementado retry logic (3 tentativas)
#    ✅ Timeout reduzido (60s → 30s)
#    ✅ Graceful shutdown (SIGTERM/SIGINT)
#    ✅ Tratamento de uncaughtException
#    ✅ Tratamento de unhandledRejection
#    ✅ Logs melhorados (timestamp, counters)

# 3. VARIÁVEIS DE AMBIENTE
#    ❌ Antes: SUPABASE_ANON_KEY → ✅ Depois: SUPABASE_KEY
#    ✅ Adicionado .env.example como template
#    ✅ .env nunca commitado (gitignore)

# 4. RAILWAY CONFIG
#    ✅ Procfile: worker: node worker.js
#    ✅ .railwayignore: Ignore desnecessários
#    ✅ .npmrc: Configuração npm

# ============================================================
# 🚀 COMO USAR
# ============================================================

echo "📝 QUICK REFERENCE - RivalWatch Worker"
echo ""
echo "🔧 Setup Inicial:"
echo "  1. cd worker"
echo "  2. npm install"
echo "  3. npm run check"
echo "  4. npm start"
echo ""
echo "📤 Deploy:"
echo "  1. git add ."
echo "  2. git commit -m 'fix: worker ready for railway'"
echo "  3. git push origin main"
echo ""
echo "📊 Railway:"
echo "  1. Adicionar SUPABASE_URL"
echo "  2. Adicionar SUPABASE_KEY (service_role)"
echo "  3. Redeploy"
echo ""
echo "📋 Monitorar:"
echo "  railway logs --follow"
echo ""
echo "🛑 Parar:"
echo "  CTRL+C (local) ou Railway dashboard"
echo ""

# ============================================================
# 🔍 ESTRUTURA DE ARQUIVOS
# ============================================================

echo "📁 Arquivos do Worker:"
echo "  worker.js              ← Script principal (CORRIGIDO)"
echo "  package.json           ← Dependências (CORRIGIDO)"
echo "  .env                   ← Variáveis (GITIGNORE)"
echo "  .env.example           ← Template (COMMITAR)"
echo "  Procfile               ← Railway config"
echo "  .railwayignore         ← Ignore list"
echo "  .npmrc                 ← npm config"
echo ""
echo "📚 Documentação:"
echo "  00-LEIA-PRIMEIRO.md    ← COMECE AQUI"
echo "  QUICK_START.md         ← Start rápido"
echo "  README.md              ← Visão geral"
echo "  RAILWAY_DEPLOYMENT.md  ← Deploy completo"
echo "  ARQUITETURA.md         ← Como funciona"
echo "  TROUBLESHOOTING.md     ← Problemas"
echo "  INDEX.md               ← Navegação"
echo ""

# ============================================================
# ⚡ CHECKLIST PRÉ-DEPLOY
# ============================================================

echo "✅ PRÉ-DEPLOY CHECKLIST:"
echo "  [ ] npm run check passa?"
echo "  [ ] npm start roda sem erros?"
echo "  [ ] .env NÃO está em git status?"
echo "  [ ] package.json tem 'type': 'module'?"
echo "  [ ] package.json tem 'start': 'node worker.js'?"
echo "  [ ] Procfile existe?"
echo ""

# ============================================================
# 🔑 VARIÁVEIS CRÍTICAS
# ============================================================

echo "🔑 Variáveis de Ambiente (Railway):"
echo "  SUPABASE_URL=https://seu-projeto.supabase.co"
echo "  SUPABASE_KEY=sua_chave_secreta"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  - SUPABASE_KEY = service_role secret (NÃO anon key)"
echo "  - Encontre em: Supabase > Settings > API > service_role secret"
echo ""

# ============================================================
# 🎯 FLUXO DO WORKER
# ============================================================

echo "🔄 Fluxo de Execução:"
echo "  1. node worker.js"
echo "  2. Validar variáveis de ambiente"
echo "  3. Conectar ao Supabase"
echo "  4. Loop infinito (a cada 10 min):"
echo "     a. SELECT * FROM sites"
echo "     b. Para cada site: Puppeteer scraping"
echo "     c. Extrai preço com regex"
echo "     d. UPDATE sites SET last_price"
echo "     e. INSERT INTO price_logs"
echo "     f. Aguarda 10 minutos"
echo "     g. Volta ao passo 4"
echo ""

# ============================================================
# 📞 REFERÊNCIA RÁPIDA
# ============================================================

echo "🛠️  Comandos Úteis:"
echo "  npm install         ← Instalar dependências"
echo "  npm run check       ← Validar configuração"
echo "  npm start           ← Iniciar worker"
echo "  git add .           ← Stage arquivos"
echo "  git commit -m '...' ← Criar commit"
echo "  git push            ← Enviar para GitHub"
echo "  railway logs -f     ← Ver logs Railway"
echo "  railway restart     ← Reiniciar serviço"
echo ""

# ============================================================
# 🎓 LEITURA RECOMENDADA
# ============================================================

echo "📚 Documentação por Nível:"
echo ""
echo "  INICIANTE:"
echo "    1. 00-LEIA-PRIMEIRO.md"
echo "    2. QUICK_START.md"
echo "    3. RAILWAY_DEPLOYMENT.md"
echo ""
echo "  INTERMEDIÁRIO:"
echo "    1. RESUMO_MUDANCAS.md"
echo "    2. ARQUITETURA.md"
echo "    3. README.md"
echo ""
echo "  AVANÇADO:"
echo "    1. TROUBLESHOOTING.md"
echo "    2. worker.js (código fonte)"
echo "    3. ARQUITETURA.md (escalabilidade)"
echo ""

# ============================================================
# 🚀 PRÓXIMO PASSO
# ============================================================

echo "➡️  PRÓXIMO PASSO:"
echo "  cd worker && npm install && npm run check"
echo ""
echo "✅ Se tudo OK, execute:"
echo "  git add . && git commit -m 'fix: worker pronto' && git push origin main"
echo ""
echo "🎉 Sucesso!"
