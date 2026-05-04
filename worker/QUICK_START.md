# GUIA RÁPIDO - Deploy em 5 Minutos

## ⚡ Para o Usuário Apressado

### 1. Clone/Acesse o projeto
```bash
cd rivalwatch/worker
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis
```bash
cp .env.example .env
# EDITE O ARQUIVO .env COM SUAS CREDENCIAIS
```

**Obter credenciais Supabase:**
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings > API
4. Copie: **Project URL** → SUPABASE_URL
5. Copie: **service_role secret** (não anon key!) → SUPABASE_KEY

### 4. Teste localmente
```bash
npm run check   # Valida a configuração
npm start       # Inicia o worker (CTRL+C para parar)
```

Você deve ver:
```
🚀 Worker iniciado com sucesso!
✅ SUPABASE_URL: Configurado
✅ SUPABASE_KEY: Configurado
```

### 5. Deploy na Railway
```bash
git add .
git commit -m "fix: worker pronto para railway"
git push origin main
```

Railway fará o deploy automaticamente!

### 6. Configure Railway (1 min)
1. Acesse: https://railway.app
2. Selecione seu projeto
3. Vá para: **Variables**
4. Adicione:
   ```
   SUPABASE_URL=seu_valor
   SUPABASE_KEY=seu_valor
   ```
5. Clique em **Redeploy**

### 7. Pronto! 🎉
Seu worker está rodando. Verifique os logs:
- Railway > Project > Logs
- Procure por: `🚀 Worker iniciado com sucesso!`

---

## 🔧 Troubleshooting Rápido

**P: "SUPABASE_KEY: NÃO CONFIGURADO"**
R: Adicione a variável no painel do Railway

**P: Worker não inicia**
R: Verifique: `railway logs --follow`

**P: "No start command detected"**
R: Commit package.json e dê push

---

## 📚 Para Mais Detalhes
- Veja: `README.md`
- Deployment: `RAILWAY_DEPLOYMENT.md`
- Resumo de mudanças: `RESUMO_MUDANCAS.md`

---

**Pronto? Vá pro passo 1! 🚀**
