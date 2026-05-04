#!/usr/bin/env node

/**
 * Script de verificação pré-deployment para Railway
 * Executa: npm run check
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

console.log('\n📋 Verificando configuração do worker...\n');

const checks = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_KEY': process.env.SUPABASE_KEY,
  'NODE_ENV': process.env.NODE_ENV || 'development',
  'Node.js Version': process.version,
};

let hasErrors = false;

for (const [key, value] of Object.entries(checks)) {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`❌ ${key}: NÃO CONFIGURADO`);
    if (key.startsWith('SUPABASE')) hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Configure-as em: Railway Dashboard > Project > Variables\n');
  process.exit(1);
}

// Tenta conexão com Supabase
console.log('\n🔌 Testando conexão com Supabase...');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

try {
  const { data, error } = await supabase.from('sites').select('count');
  if (error) {
    console.error(`❌ Erro ao conectar: ${error.message}`);
    process.exit(1);
  }
  console.log('✅ Conexão com Supabase: OK\n');
} catch (err) {
  console.error(`❌ Erro: ${err.message}`);
  process.exit(1);
}

console.log('✅ Todas as verificações passaram!\n');
console.log('🚀 Pronto para deployment na Railway!\n');
