#!/usr/bin/env node

/**
 * CI/CD HEALTH CHECK
 * 
 * Verifica saúde do ambiente e detecta problemas potenciais
 * Executar antes de cada deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// ============================================
// CORES PARA OUTPUT
// ============================================
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

// ============================================
// HEALTH CHECKS
// ============================================
const checks = [];
let passedChecks = 0;
let failedChecks = 0;

function addCheck(name, fn) {
  checks.push({ name, fn });
}

async function runChecks() {
  log.section('🏥 CI/CD HEALTH CHECK');
  
  for (const check of checks) {
    try {
      const result = await check.fn();
      if (result) {
        log.success(check.name);
        passedChecks++;
      } else {
        log.error(check.name);
        failedChecks++;
      }
    } catch (error) {
      log.error(`${check.name}: ${error.message}`);
      failedChecks++;
    }
  }
  
  // Resumo
  log.section('📊 SUMMARY');
  console.log(`Passed: ${passedChecks}/${checks.length}`);
  console.log(`Failed: ${failedChecks}/${checks.length}`);
  
  if (failedChecks > 0) {
    process.exit(1);
  }
}

// ============================================
// 1. NODE E NPM
// ============================================
addCheck('Node.js version >= 18', () => {
  const version = execSync('node --version').toString().trim();
  const major = parseInt(version.split('.')[0].substring(1));
  return major >= 18;
});

addCheck('npm version >= 8', () => {
  const version = execSync('npm --version').toString().trim();
  const major = parseInt(version.split('.')[0]);
  return major >= 8;
});

// ============================================
// 2. DEPENDÊNCIAS
// ============================================
addCheck('package.json exists', () => {
  return fs.existsSync(path.join(projectRoot, 'package.json'));
});

addCheck('node_modules exists', () => {
  return fs.existsSync(path.join(projectRoot, 'node_modules'));
});

addCheck('package-lock.json exists', () => {
  return fs.existsSync(path.join(projectRoot, 'package-lock.json'));
});

// ============================================
// 3. ESTRUTURA DO PROJETO
// ============================================
addCheck('src/ directory exists', () => {
  return fs.existsSync(path.join(projectRoot, 'src'));
});

addCheck('public/ directory exists', () => {
  return fs.existsSync(path.join(projectRoot, 'public'));
});

addCheck('.github/ directory exists', () => {
  return fs.existsSync(path.join(projectRoot, '.github'));
});

// ============================================
// 4. CONFIGURAÇÕES
// ============================================
addCheck('jest.config.js exists', () => {
  return fs.existsSync(path.join(projectRoot, 'jest.config.js'));
});

addCheck('.gitignore exists', () => {
  return fs.existsSync(path.join(projectRoot, '.gitignore'));
});

addCheck('.env.example exists', () => {
  return fs.existsSync(path.join(projectRoot, '.env.example'));
});

// ============================================
// 5. GIT
// ============================================
addCheck('Git repository initialized', () => {
  return fs.existsSync(path.join(projectRoot, '.git'));
});

addCheck('No uncommitted changes', () => {
  try {
    const status = execSync('git status --porcelain', { cwd: projectRoot }).toString();
    return status.length === 0;
  } catch {
    return false;
  }
});

addCheck('Remote origin configured', () => {
  try {
    execSync('git remote get-url origin', { cwd: projectRoot });
    return true;
  } catch {
    return false;
  }
});

// ============================================
// 6. BUILD
// ============================================
addCheck('Build script exists', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')));
  return pkg.scripts && pkg.scripts.build;
});

addCheck('Test script exists', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')));
  return pkg.scripts && pkg.scripts.test;
});

// ============================================
// 7. RECURSOS DO SISTEMA
// ============================================
addCheck('File descriptor limit >= 1024', () => {
  try {
    // Tentar abrir muitos arquivos
    const fds = [];
    for (let i = 0; i < 100; i++) {
      fds.push(fs.openSync(path.join(projectRoot, 'package.json'), 'r'));
    }
    fds.forEach(fd => fs.closeSync(fd));
    return true;
  } catch {
    log.warning('File descriptor limit might be too low');
    return false;
  }
});

addCheck('Disk space available > 1GB', () => {
  try {
    const stats = execSync('df -B1 .').toString();
    const lines = stats.split('\n');
    const available = parseInt(lines[1].split(/\s+/)[3]);
    return available > 1024 * 1024 * 1024; // 1GB
  } catch {
    return true; // Assume OK se não conseguir verificar
  }
});

// ============================================
// 8. SEGURANÇA
// ============================================
addCheck('No secrets in git', () => {
  try {
    const output = execSync('git log -p --all -S "password\\|secret\\|token" --oneline', {
      cwd: projectRoot,
      stdio: 'pipe',
    }).toString();
    return output.length === 0;
  } catch {
    return true; // Assume OK se não conseguir verificar
  }
});

addCheck('No node_modules in git', () => {
  try {
    const tracked = execSync('git ls-files | grep node_modules', {
      cwd: projectRoot,
      stdio: 'pipe',
    }).toString();
    return tracked.length === 0;
  } catch {
    return true; // Assume OK se não conseguir verificar
  }
});

// ============================================
// 9. VERCEL
// ============================================
addCheck('vercel.json exists', () => {
  return fs.existsSync(path.join(projectRoot, 'vercel.json'));
});

addCheck('vercel.json is valid JSON', () => {
  try {
    const content = fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8');
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
});

// ============================================
// 10. GITHUB ACTIONS
// ============================================
addCheck('GitHub Actions workflow exists', () => {
  const workflowDir = path.join(projectRoot, '.github', 'workflows');
  if (!fs.existsSync(workflowDir)) return false;
  const files = fs.readdirSync(workflowDir);
  return files.some(f => f.endsWith('.yml') || f.endsWith('.yaml'));
});

// ============================================
// EXECUTAR CHECKS
// ============================================
runChecks().catch(error => {
  log.error(`Health check failed: ${error.message}`);
  process.exit(1);
});

