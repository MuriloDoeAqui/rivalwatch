#!/usr/bin/env node

/**
 * Script de instalação pós-deploy para Railway
 * Executa automaticamente após npm install
 */

console.log('\n📦 RivalWatch Worker - Instalação concluída!\n');
console.log('✅ Dependências instaladas com sucesso');
console.log('✅ Pronto para iniciar na Railway\n');
console.log('📝 Próximos passos:');
console.log('   1. Configure as variáveis de ambiente no Railway:');
console.log('      - SUPABASE_URL');
console.log('      - SUPABASE_KEY (service_role key)\n');
console.log('   2. O worker iniciará automaticamente com:');
console.log('      npm start\n');
console.log('🎉 Worker está pronto!\n');
