# ✅ Checklist Final de Validação

Use este checklist antes de fazer push para Railway!

## 🔍 Arquivos Corrigidos

- [ ] **package.json**
  - [ ] `"start": "node worker.js"` existe?
  - [ ] `"type": "module"` está definido?
  - [ ] Não tem `"type": "commonjs"`?
  - [ ] Tem `"@supabase/supabase-js"` na dependencies?
  - [ ] Tem `"dotenv"` na dependencies?
  - [ ] Tem `"puppeteer"` na dependencies?
  - [ ] Não tem `"node-fetch"` (não precisa)?

- [ ] **worker.js**
  - [ ] Começa com `import puppeteer from 'puppeteer'`?
  - [ ] Tem validação de env vars no início?
  - [ ] Tem `scrape()` com retry logic?
  - [ ] Tem `run()` com tratamento de erros?
  - [ ] Tem `start()` com loop de 10 minutos?
  - [ ] Tem `process.on('SIGTERM')`?
  - [ ] Tem `process.on('SIGINT')`?
  - [ ] Tem `process.on('uncaughtException')`?
  - [ ] Tem `process.on('unhandledRejection')`?

- [ ] **.env**
  - [ ] `SUPABASE_URL` tem valor real?
  - [ ] `SUPABASE_KEY` tem valor real?
  - [ ] Não tem valores padrão como `sua_chave_aqui`?
  - [ ] Não vai ser commitado no Git?

- [ ] **Procfile**
  - [ ] Existe e tem conteúdo: `worker: node worker.js`?

- [ ] **.env.example**
  - [ ] Existe como template?
  - [ ] Tem comentários explicando as variáveis?

- [ ] **.railwayignore**
  - [ ] Existe?
  - [ ] Ignora node_modules?
  - [ ] Ignora .env?

- [ ] **.gitignore**
  - [ ] Tem `.env` (não commitá-lo)?
  - [ ] Tem `node_modules`?

- [ ] **README.md**
  - [ ] Existe com instruções?

- [ ] **RAILWAY_DEPLOYMENT.md**
  - [ ] Existe com guia de deploy?

## 🧪 Testes Locais

### Teste 1: Instalação
```bash
cd worker
npm install
```
- [ ] Instalou sem erros?
- [ ] Criou node_modules?
- [ ] Criou package-lock.json?

### Teste 2: Validação de Configuração
```bash
npm run check
```
- [ ] Rodou sem erros?
- [ ] Mostrou `✅ Todas as verificações passaram`?

Esperado ver:
```
✅ SUPABASE_URL: Configurado
✅ SUPABASE_KEY: Configurado
✅ Conexão com Supabase: OK
✅ Todas as verificações passaram!
```

### Teste 3: Start Worker
```bash
npm start
```
- [ ] Worker iniciou sem erros?
- [ ] Mostrou `🚀 Worker iniciado com sucesso!`?
- [ ] Mostrou status do Supabase?
- [ ] Começou o ciclo de monitoramento?

Esperado ver:
```
🚀 Worker iniciado com sucesso!
✅ SUPABASE_URL: Configurado
✅ SUPABASE_KEY: Configurado
⏱️  Intervalo de monitoramento: 10 minutos

🔄 [DATA/HORA] Iniciando ciclo de monitoramento...
```

- [ ] Depois de 10 minutos, iniciou novo ciclo?
- [ ] Pode parar com CTRL+C sem erros?

### Teste 4: Verificar .env não foi commitado
```bash
git status
```
- [ ] `.env` NÃO aparece na lista?
- [ ] `.env.example` SIM aparece?

## 🚀 Preparação para Deploy

### Git
```bash
git add .
git status
```
- [ ] Package.json modificado?
- [ ] worker.js modificado?
- [ ] Procfile adicionado?
- [ ] Arquivos corretos staged?
- [ ] .env NÃO aparece?

```bash
git commit -m "fix: worker configuração para railway"
```
- [ ] Commit criado com sucesso?

```bash
git log --oneline -5
```
- [ ] Seu commit aparece no topo?

```bash
git push origin main
```
- [ ] Push completou sem erros?

## 🏃 Configuração na Railway

- [ ] Conectou repo ao Railway?
- [ ] Railway detectou package.json?
- [ ] Railway criou a instância?

### Variáveis de Ambiente
- [ ] Adicionou `SUPABASE_URL`?
- [ ] Adicionou `SUPABASE_KEY` (chave SECRETA)?
- [ ] Não usou SUPABASE_ANON_KEY?
- [ ] Salou as variáveis?

### Deploy
- [ ] Railway iniciou o deploy automático?
- [ ] Sem erros de build?
- [ ] Inicialização começou?

## 📊 Monitoramento na Railway

```bash
railway logs --follow
```

Procure por:
- [ ] `🚀 Worker iniciado com sucesso!` ✅
- [ ] `✅ SUPABASE_URL: Configurado` ✅
- [ ] `✅ SUPABASE_KEY: Configurado` ✅
- [ ] `🔄 Iniciando ciclo de monitoramento...` ✅
- [ ] `📊 X site(s) para monitorar` ✅

Se vir:
- [ ] Erros? Verifique os logs
- [ ] ❌ "SUPABASE_KEY: NÃO CONFIGURADO"? Adicione no Railway
- [ ] ❌ "Erro ao conectar"? Verifique credenciais Supabase

## 🎯 Último Checklist

Antes de considerar pronto:

- [ ] ✅ Todos os arquivos existem
- [ ] ✅ Todos os testes locais passaram
- [ ] ✅ Git commits estão corretos
- [ ] ✅ Railway tem as variáveis corretas
- [ ] ✅ Worker está rodando sem erros nos logs
- [ ] ✅ A cada 10 minutos, um novo ciclo inicia
- [ ] ✅ Preços estão sendo atualizados no Supabase

## 🆘 Se Algo Falhar

1. **Verifique os logs primeiro:**
   ```bash
   railway logs --follow
   # ou localmente
   npm start
   ```

2. **Erro comum: SUPABASE_KEY não configurado**
   - ✅ Railway > Variables > Adicionar SUPABASE_KEY
   - ✅ Use a chave SECRETA, não anon key
   - ✅ Redeploy

3. **Erro comum: Package.json não tem start**
   - ✅ Verifique se `"start": "node worker.js"` existe
   - ✅ Commit e push
   - ✅ Railway fará redeploy

4. **Worker não inicia**
   - ✅ Teste localmente: `npm start`
   - ✅ Verifique logs: `railway logs --follow`
   - ✅ Procure por mensagens de erro

5. **Não consegue conectar ao Supabase**
   - ✅ Verifique SUPABASE_URL está correto
   - ✅ Verifique SUPABASE_KEY está correto (service_role)
   - ✅ Teste localmente: `npm run check`

## 📞 Precisa de Ajuda?

1. Veja: `README.md` (instruções gerais)
2. Veja: `RAILWAY_DEPLOYMENT.md` (deploy)
3. Veja: `RESUMO_MUDANCAS.md` (mudanças)
4. Veja: `ARQUITETURA.md` (arquitetura)

---

✅ **Sucesso! Seu worker está pronto para produção!**

**Próximo passo: `git push origin main` 🚀**
