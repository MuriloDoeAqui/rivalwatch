# 🏗️ Arquitetura RivalWatch

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 USUÁRIO                               │
└────────────────────────┬────────────────────────────────────┘
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
     ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐   ┌──────────────┐
│   Frontend   │  │   Frontend   │   │   Frontend   │
│   (Vercel)   │  │   (Vercel)   │   │   (Vercel)   │
│  React/Vite  │  │  React/Vite  │   │  React/Vite  │
└──────┬───────┘  └──────┬───────┘   └──────┬───────┘
       │                 │                   │
       └─────────────────┼───────────────────┘
                         │
                    (Reads/Writes)
                         │
        ┌────────────────▼──────────────┐
        │                               │
        │    🔐 SUPABASE                │
        │    (PostgreSQL + API REST)    │
        │                               │
        │  Tables:                      │
        │  ├─ sites                     │
        │  ├─ price_logs                │
        │  ├─ users                     │
        │  └─ ...                       │
        └────────────────▲──────────────┘
                         │
                   (Writes Prices)
                         │
        ┌────────────────┴──────────────┐
        │                               │
        ▼                               │
   🔄 WORKER                           │
   (Railway)                      (Reads Prices)
   ┌─────────────────┐                │
   │ worker.js       │                │
   │ ┌─────────────┐ │                │
   │ │ 1. Fetch    │ │                │
   │ │    sites    │ │                │
   │ └──────┬──────┘ │                │
   │        │        │                │
   │ ┌──────▼──────┐ │                │
   │ │ 2. Scrape   │ │                │
   │ │    with     │ │                │
   │ │ Puppeteer   │ │                │
   │ └──────┬──────┘ │                │
   │        │        │                │
   │ ┌──────▼──────┐ │                │
   │ │ 3. Update   │ │                │
   │ │    prices   │ ├────────────────┘
   │ │    to DB    │ │
   │ └─────────────┘ │
   │                 │
   │ Runs every:     │
   │ 10 minutes      │
   │ (continuous)    │
   └─────────────────┘
```

---

## Fluxo de Dados

### 1️⃣ Cadastro de Site (Frontend)
```
Usuário (Frontend/Vercel)
    ↓
Insert em: sites
    ↓
Supabase (PostgreSQL)
```

### 2️⃣ Monitoramento de Preço (Worker/Railway)
```
Worker executa a cada 10 min:

1. SELECT * FROM sites
   ↑
   └─ Supabase

2. Para cada site:
   - Scrape URL com Puppeteer
   - Extrai preço
   
3. UPDATE sites SET last_price
   ↓
   └─ Supabase

4. INSERT INTO price_logs
   ↓
   └─ Supabase
```

### 3️⃣ Visualização de Dados (Frontend)
```
Usuário acessa dashboard
    ↓
Lê: sites.last_price
Lê: price_logs (histórico)
    ↓
Supabase (SELECT com filtros)
    ↓
Exibe gráficos/tabelas
```

---

## Componentes Técnicos

### 📱 Frontend (Vercel)
- **Tecnologia:** React + TypeScript + Vite
- **Build:** Vite
- **Deploy:** Vercel (automático)
- **Responsabilidade:**
  - UI/UX para gerenciar sites
  - Dashboard com gráficos de preços
  - Autenticação via Supabase
  - Tempo real com Supabase

### 🤖 Worker (Railway)
- **Tecnologia:** Node.js + Puppeteer
- **Tipo:** Serviço contínuo (não API)
- **Deploy:** Railway (GitHub)
- **Responsabilidade:**
  - Scraping de preços
  - Atualizar Supabase
  - Rodar a cada 10 minutos
  - Retry automático

### 🗄️ Banco de Dados (Supabase)
- **Tecnologia:** PostgreSQL + Row Level Security
- **API:** REST API
- **Autenticação:** JWT (Supabase Auth)
- **Tabelas principais:**
  - `sites`: URLs para monitorar
  - `price_logs`: Histórico de preços
  - `users`: Usuários da app

---

## Estrutura de Pastas

```
RivalWatch/
├── rivalwatch/              # Frontend (React)
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── worker/                  # Worker (Node.js) ← CORRIGIDO
│   ├── worker.js            # ✅ Script principal
│   ├── package.json         # ✅ Com start script
│   ├── Procfile             # ✅ Config Railway
│   ├── .env.example         # ✅ Template env
│   └── ...
│
├── .git/
└── README.md
```

---

## Ciclo de Vida do Worker

### Inicialização
```
1. npm start (Railway executa)
2. worker.js inicia
3. Valida SUPABASE_URL e SUPABASE_KEY
4. Se faltarem, faz exit(1)
5. Conecta ao Supabase
6. Inicia loop
```

### Ciclo de Monitoramento (10 min)
```
1. Busca todos os sites em: SELECT * FROM sites
2. Para cada site:
   a. Inicia Puppeteer
   b. Acessa URL
   c. Extrai preço com regex
   d. Fecha browser
   e. Atualiza DB
   f. Aguarda 2 seg (não sobrecarregar)
3. Logs com resultado
4. Aguarda 10 minutos
5. Volta ao passo 1
```

### Tratamento de Falhas
```
Erro ao scrape?
├─ Tenta novamente (max 3 vezes)
├─ Se falhar: insere NULL
└─ Continua com próximo site

Erro não capturado?
├─ Captura em: uncaughtException
├─ Loga o erro
└─ Reinicia após 5 seg

Process termina (SIGTERM)?
├─ Captura sinal
├─ Fecha conexões gracefully
└─ Exit(0)
```

---

## Variáveis de Ambiente

### Frontend (Vercel)
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Worker (Railway)
```
SUPABASE_URL=https://...
SUPABASE_KEY=eyJ...  ← Chave SECRETA!
```

⚠️ **Importante:** Worker usa a chave SECRETA porque precisa fazer INSERT/UPDATE em qualquer site, não apenas do usuário.

---

## Fluxo de Deploy

### 1. Desenvolvimento Local
```
git clone ...
cd worker
npm install
.env → credenciais locais
npm start
```

### 2. Push para GitHub
```
git add .
git commit -m "..."
git push origin main
```

### 3. Railway Auto-Deploy
```
GitHub webhook → Railway
Package.json detecta: "start": "node worker.js"
npm install → npm start
Variáveis de env → Railway Dashboard
Worker inicia
```

### 4. Produção
```
Worker rodando continuamente
A cada 10 min: ciclo de monitoramento
Logs em tempo real
Redeploy: push para main
```

---

## Monitoramento

### Verificar Status

#### Localmente
```bash
npm start    # Inicia e mostra logs
npm run check # Valida config
```

#### Na Railway
```bash
railway logs --follow
```

Procure por:
- 🚀 `Worker iniciado com sucesso!` - Tudo OK
- 🔄 `Iniciando ciclo` - Executando
- ✅ `Ciclo finalizado` - Pronto
- ❌ `Erro` - Algo errado

### Métricas Importantes
- Tempo de ciclo: ~5-10 min (depende qty sites)
- Memória: ~200-400 MB
- CPU: Spike durante scraping
- Requisições Supabase: ~N sites/ciclo

---

## Escalabilidade

### Quando Aumentar?

**Mais Sites:**
- Aumentar quantidade de instâncias worker na Railway
- Ou aumentar intervalo entre ciclos

**Mais Detalhes por Site:**
- Adicionar logs de performance
- Rastrear mudanças de preço

**Mais Usuários:**
- Nada muda no worker
- Frontend já escala com Vercel
- Supabase escala automaticamente

---

## Segurança

✅ **Implementado:**
- Variáveis de ambiente (não hardcoded)
- Chave secreta para worker (apenas update)
- HTTPS/TLS para conexões
- Rate limiting no Supabase

⚠️ **Considerações:**
- Não armazenar senhas de sites
- Revisar regex de extração de preço
- Monitorar logs para anomalias

---

## Próximos Passos

1. **Deploy:** `git push origin main`
2. **Configurar Railway:** Adicionar SUPABASE_URL e SUPABASE_KEY
3. **Monitorar:** Verificar logs no painel Railway
4. **Otimizar:** Se necessário, aumentar RAM ou recursos

---

**Pronto! Sua arquitetura está pronta para produção! 🚀**
