# RivalWatch Worker

Worker de scraping de preços que monitora sites continuamente e armazena dados no Supabase.

## 🚀 Funcionalidades

- ✅ Scraping de preços com Puppeteer
- ✅ Armazenamento em Supabase
- ✅ Ciclo de monitoramento a cada 10 minutos
- ✅ Retry automático em caso de falha
- ✅ Tratamento robusto de erros
- ✅ Logs detalhados
- ✅ Suporta sinais SIGTERM/SIGINT para graceful shutdown

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- Conta Supabase ativa
- Variáveis de ambiente configuradas

## 🔧 Configuração Local

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Edite o arquivo `.env`:**
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-secreta
   ```

   ⚠️ **Importante:** Use a chave SECRETA (service_role), não a anon key!
   - Acesse: Supabase > Settings > API > Project API Keys
   - Copie o valor de "service_role secret"

4. **Execute localmente:**
   ```bash
   npm start
   ```

## 🚄 Deploy na Railway

1. **Conecte seu repositório ao Railway**
   - Vá para [railway.app](https://railway.app)
   - Clique em "New Project" > "Deploy from GitHub"
   - Selecione o repositório

2. **Configure as variáveis de ambiente:**
   - No painel do Railway, vá para "Variables"
   - Adicione:
     ```
     SUPABASE_URL=seu_url
     SUPABASE_KEY=sua_chave_secreta
     ```

3. **Configure o serviço como Worker:**
   - Railway detectará automaticamente o script `start` do package.json
   - O Procfile garantirá o tipo correto de serviço

4. **Monitore os logs:**
   - No painel do Railway: "Logs"
   - Você verá os logs em tempo real do worker

## 📊 Estrutura do Banco de Dados Esperada

Tabelas necessárias no Supabase:

### `sites`
- `id` (UUID, PK)
- `url` (TEXT)
- `last_price` (DECIMAL, nullable)
- `last_checked` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `price_logs`
- `id` (UUID, PK)
- `site_id` (UUID, FK)
- `price` (DECIMAL)
- `created_at` (TIMESTAMP)

## 🔍 Monitoramento

### Logs em tempo real
```bash
# Railway
railway logs --follow

# Local
npm start
```

### Sinais de status
- 🚀 Worker iniciado com sucesso
- 🔄 Ciclo de monitoramento iniciado
- 💰 Preço encontrado
- ⚠️ Preço não encontrado
- ❌ Erro durante scraping
- ✅ Ciclo finalizado
- 🛑 Encerrando gracefully

## 🐛 Troubleshooting

### "No start command detected"
- ✅ Certifique-se de que `package.json` tem `"start": "node worker.js"`
- ✅ Commit e push para Railway

### Erros de Supabase
- Verifique se `SUPABASE_URL` e `SUPABASE_KEY` estão corretos
- Use a chave SECRETA, não a anon key
- Verifique as permissões da chave no Supabase

### Puppeteer não funciona no Railway
- ✅ O código já tem `--no-sandbox --disable-setuid-sandbox`
- ✅ Verifica `--disable-dev-shm-usage` para economizar memória
- Se ainda falhar, pode ser necessário aumentar a RAM do dyno

### Worker crashando silenciosamente
- Verificar logs do Railway
- O worker tem tratamento de `uncaughtException` - deve reiniciar automaticamente

## 📝 Customização

### Alterar intervalo de monitoramento
No arquivo `worker.js`, altere a linha:
```javascript
setTimeout(start, 10 * 60 * 1000); // Mude para 5 minutos = 5 * 60 * 1000
```

### Adicionar novos padrões de preço
No arquivo `worker.js`, altere a função `extractPrice()`:
```javascript
const patterns = [
  /R\$ ?([\d\.,]+)/,
  /seu_novo_padrão/,
  // ...
];
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs (Railway ou local)
2. Valide as variáveis de ambiente
3. Certifique-se que o Supabase está acessível

---

**Mantém por:** RivalWatch Team
