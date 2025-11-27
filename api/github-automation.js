/**
 * GITHUB AUTOMATION API
 * Endpoint para commits, pushes e PRs automáticos
 * Vercel Serverless Function
 */

const GitHubAutomation = require('../src/automation/GitHubAutomation');

let gitHub;

// Inicializar GitHub Automation
try {
  gitHub = new GitHubAutomation(process.env.GITHUB_TOKEN);
} catch (error) {
  console.error('Erro ao inicializar GitHub Automation:', error.message);
}

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar se GitHub está inicializado
  if (!gitHub) {
    return res.status(500).json({
      error: 'GitHub Automation não inicializado',
      message: 'GITHUB_TOKEN não configurado',
    });
  }

  try {
    // POST: Commit + Push
    if (req.method === 'POST' && req.body.action === 'commit-and-push') {
      const { owner, repo, files, message, branch = 'main', author } = req.body;

      if (!owner || !repo || !files || !message) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['owner', 'repo', 'files', 'message'],
        });
      }

      console.log(`📝 Commit + Push: ${owner}/${repo}/${branch}`);

      const result = await gitHub.commitAndPush(
        owner,
        repo,
        files,
        message,
        branch,
        author
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    }

    // POST: Criar Pull Request
    if (req.method === 'POST' && req.body.action === 'create-pr') {
      const { owner, repo, title, body, head, base = 'main' } = req.body;

      if (!owner || !repo || !title || !head) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['owner', 'repo', 'title', 'head'],
        });
      }

      console.log(`🔀 Criando PR: ${owner}/${repo} (${head} → ${base})`);

      const pr = await gitHub.createPullRequest(
        owner,
        repo,
        title,
        body || '',
        head,
        base
      );

      return res.status(201).json({
        success: true,
        pr,
      });
    }

    // POST: Criar Branch
    if (req.method === 'POST' && req.body.action === 'create-branch') {
      const { owner, repo, branchName, fromBranch = 'main' } = req.body;

      if (!owner || !repo || !branchName) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['owner', 'repo', 'branchName'],
        });
      }

      console.log(`🌿 Criando branch: ${owner}/${repo}/${branchName}`);

      const branch = await gitHub.createBranch(owner, repo, branchName, fromBranch);

      return res.status(201).json({
        success: true,
        branch,
      });
    }

    // GET: Obter informações do repositório
    if (req.method === 'GET' && req.query.action === 'repo-info') {
      const { owner, repo } = req.query;

      if (!owner || !repo) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['owner', 'repo'],
        });
      }

      console.log(`📊 Obtendo info: ${owner}/${repo}`);

      const info = await gitHub.getRepositoryInfo(owner, repo);

      return res.status(200).json({
        success: true,
        info,
      });
    }

    // GET: Obter histórico de commits
    if (req.method === 'GET' && req.query.action === 'commit-history') {
      const { owner, repo, branch = 'main', limit = 10 } = req.query;

      if (!owner || !repo) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['owner', 'repo'],
        });
      }

      console.log(`📜 Obtendo histórico: ${owner}/${repo}/${branch}`);

      const history = await gitHub.getCommitHistory(owner, repo, branch, parseInt(limit));

      return res.status(200).json({
        success: true,
        commits: history,
      });
    }

    // GET: Obter conteúdo de arquivo
    if (req.method === 'GET' && req.query.action === 'get-file') {
      const { owner, repo, path, branch = 'main' } = req.query;

      if (!owner || !repo || !path) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['owner', 'repo', 'path'],
        });
      }

      console.log(`📄 Obtendo arquivo: ${owner}/${repo}/${path}`);

      const file = await gitHub.getFileContent(owner, repo, path, branch);

      return res.status(200).json({
        success: true,
        file,
      });
    }

    return res.status(400).json({
      error: 'Ação não reconhecida',
      availableActions: [
        'commit-and-push',
        'create-pr',
        'create-branch',
        'repo-info',
        'commit-history',
        'get-file',
      ],
    });
  } catch (error) {
    console.error('❌ Erro na automação GitHub:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro na automação GitHub',
      message: error.message,
    });
  }
}

module.exports = handler;
