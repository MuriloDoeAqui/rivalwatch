# Railway Configuration Guide

## 🚀 Deployment na Railway

### 1️⃣ Conectar Repositório

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Autorize o GitHub e selecione o repositório
5. Escolha o branch (normalmente `main`)

### 2️⃣ Configurar Variáveis de Ambiente

No painel do Railway:

1. Vá para "Variables" na seção do projeto
2. Clique em "Add Variable" e adicione:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_secreta_aqui
```

⚠️ **IMPORTANTE:** Use a chave **SECRETA** (service_role), não a anon key!

**Como obter:**
1. Acesse seu projeto no Supabase
2. Vá para: Settings > API > Project API Keys
3. Copie o valor de "service_role secret"
4. Cole no Railway

### 3️⃣ Tipo de Serviço

Railway detectará automaticamente como **Worker** graças a:
- `package.json` com `"start": "node worker.js"`
- `Procfile` com `worker: node worker.js`

### 4️⃣ Customizações (Opcional)

#### Alterar Intervalo de Monitoramento

No arquivo `worker.js`, procure por:
```javascript
setTimeout(start, 10 * 60 * 1000);
```

Mude para:
```javascript
setTimeout(start, 5 * 60 * 1000);  // 5 minutos
setTimeout(start, 15 * 60 * 1000); // 15 minutos
```

#### Aumentar Timeout do Puppeteer

Se tiver problemas com sites lentos, no `worker.js`:
```javascript
timeout: 30000,  // Mude para 60000 (60 segundos)
```

### 5️⃣ Monitoramento

#### Logs em Tempo Real

1. No painel do Railway, clique em seu projeto
2. Vá para a aba "Logs"
3. Você verá os logs em tempo real do worker

#### Sinais de Status

Procure por:
- 🚀 `Worker iniciado com sucesso` - Tudo OK
- 🔄 `Ciclo de monitoramento` - Executando ciclo
- ✅ `Ciclo finalizado` - Completado com sucesso
- ❌ `Erro crítico` - Algo deu errado

### 6️⃣ Troubleshooting

#### "No start command detected"

**Solução:**
1. Certifique-se que `package.json` está correto
2. Commit e push: `git push origin main`
3. Railway detectará automaticamente

#### Worker não inicia

**Verificar:**
1. Logs do Railway: procure por mensagens de erro
2. Variáveis de ambiente corretas?
3. Supabase está acessível?

```bash
# Teste localmente
npm install
npm start
```

#### Variáveis de ambiente não carregam

**Solução:**
1. Reinicie o serviço no Railway
2. Clique em "Redeploy" no painel

#### "SUPABASE_KEY: NÃO CONFIGURADO"

**Solução:**
1. Verifique se adicionou a variável no Railway
2. Use a chave **SECRETA**, não a anon key
3. Salve e reinicie o serviço

### 7️⃣ Performance

#### Reduzir Uso de Memória

Se der erro de memória:

1. Aumentar a RAM no Railway
   - Clique no serviço
   - "Service" > "Resources"
   - Escolha uma RAM maior

2. Ou otimize o código:
   - Aumente o intervalo entre monitoramentos
   - Reduza a quantidade de sites por ciclo

#### Custos

Railway oferece:
- **Plano Free:** $5/mês de créditos
- **Plano Pro:** $20/mês
- Worker de baixo consumo normalmente fica no plano free

### 8️⃣ Segurança

✅ **Boas práticas:**
- Nunca comita `.env` no Git
- Use `.env.example` com valores vazios
- Rotacione as chaves Supabase regularmente
- Monitore os logs para atividades estranhas

### 9️⃣ Mais Informações

- [Railway Docs](https://docs.railway.app)
- [Supabase API Keys](https://supabase.com/docs/reference/auth/config)
- [Puppeteer Railway Guide](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-hosted-services)

---

**Pronto? Faça o deploy! 🚀**
