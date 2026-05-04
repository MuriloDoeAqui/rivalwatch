#!/bin/bash
# Deploy Assistant para RivalWatch Worker
# Execute: chmod +x deploy.sh && ./deploy.sh

echo "🚀 RivalWatch Worker - Deploy Assistant"
echo "========================================"
echo ""

# Step 1: Check Node.js
echo "1️⃣ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não instalado. Instale: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version) instalado"
echo ""

# Step 2: Check dependencies
echo "2️⃣ Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi
echo "✅ Dependências OK"
echo ""

# Step 3: Validate config
echo "3️⃣ Validando configuração..."
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado"
    echo "📝 Copiando .env.example para .env..."
    cp .env.example .env
    echo "⚠️  EDITE O ARQUIVO .env COM SUAS CREDENCIAIS!"
    echo ""
fi

# Step 4: Check .env variables
if grep -q "sua_chave_secreta_aqui" .env; then
    echo "❌ ERRO: .env contém valores padrão!"
    echo "📝 Edite .env com suas credenciais reais"
    exit 1
fi
echo "✅ .env configurado"
echo ""

# Step 5: Run validation
echo "4️⃣ Testando configuração..."
npm run check
if [ $? -ne 0 ]; then
    echo "❌ Erro na validação. Verifique as variáveis de ambiente."
    exit 1
fi
echo ""

# Step 6: Summary
echo "✅ TUDO PRONTO PARA DEPLOY!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Faça commit: git commit -am 'fix: worker ready for railway'"
echo "   2. Push para GitHub: git push origin main"
echo "   3. A Railway iniciará o deploy automaticamente"
echo "   4. Monitore os logs no painel do Railway"
echo ""
echo "🎉 Sucesso!"
