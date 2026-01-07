#!/usr/bin/env node

/**
 * Portfolio Synchronization Script
 * 
 * Syncs design components from portfolio-showcase to my-website
 * This script is designed to run in GitHub Actions but can also run locally
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  showcaseRepo: 'leon-madara/portfolio-showcase',
  showcaseRawUrl: 'https://raw.githubusercontent.com/leon-madara/portfolio-showcase/main',
  showcaseApiUrl: 'https://api.github.com/repos/leon-madara/portfolio-showcase',
  targetDir: path.join(process.cwd(), 'portfolio_src'),
  tempDir: path.join(process.cwd(), '.temp-showcase-sync'),
  buildDir: path.join(process.cwd(), 'public/portfolio_build')
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset', emoji = '') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${emoji}${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

// Fetch file from GitHub
function fetchFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Get directory tree from GitHub API
async function getDirectoryTree(dirPath) {
  const url = `${CONFIG.showcaseApiUrl}/contents/${dirPath}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'portfolio-sync-script',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch directory ${dirPath}: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Recursively download directory
async function downloadDirectory(remotePath, localPath) {
  log(`Downloading ${remotePath}...`, 'cyan', '📥 ');
  
  try {
    const items = await getDirectoryTree(remotePath);
    
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }
    
    for (const item of items) {
      if (item.type === 'file') {
        const content = await fetchFile(item.download_url);
        const filePath = path.join(localPath, item.name);
        fs.writeFileSync(filePath, content);
        log(`  ✓ ${item.name}`, 'green', '  ');
      } else if (item.type === 'dir') {
        await downloadDirectory(item.path, path.join(localPath, item.name));
      }
    }
  } catch (error) {
    log(`Failed to download ${remotePath}: ${error.message}`, 'red', '❌ ');
    throw error;
  }
}

// Step 1: Create directory structure
async function createDirectories() {
  log('Creating directory structure...', 'yellow', '📁 ');
  
  const dirs = [
    path.join(CONFIG.targetDir, 'src/components/portfolio'),
    path.join(CONFIG.targetDir, 'src/components/ui'),
    path.join(CONFIG.targetDir, 'src/data'),
    path.join(CONFIG.targetDir, 'src/hooks'),
    path.join(CONFIG.targetDir, 'src/lib'),
    path.join(CONFIG.targetDir, 'src/pages')
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Created ${path.relative(process.cwd(), dir)}`, 'green', '  ✓ ');
    }
  }
}

// Step 2: Download components from showcase
async function downloadComponents() {
  log('\nDownloading components from portfolio-showcase...', 'yellow', '📦 ');
  
  const downloads = [
    {
      remote: 'src/components/portfolio',
      local: path.join(CONFIG.targetDir, 'src/components/portfolio')
    },
    {
      remote: 'src/components/ui',
      local: path.join(CONFIG.targetDir, 'src/components/ui')
    },
    {
      remote: 'src/data',
      local: path.join(CONFIG.targetDir, 'src/data')
    },
    {
      remote: 'src/hooks',
      local: path.join(CONFIG.targetDir, 'src/hooks')
    },
    {
      remote: 'src/lib',
      local: path.join(CONFIG.targetDir, 'src/lib')
    },
    {
      remote: 'src/pages',
      local: path.join(CONFIG.targetDir, 'src/pages')
    }
  ];
  
  for (const { remote, local } of downloads) {
    try {
      await downloadDirectory(remote, local);
    } catch (error) {
      log(`Warning: Could not download ${remote}`, 'yellow', '⚠️  ');
    }
  }
}

// Step 3: Download individual files
async function downloadConfigFiles() {
  log('\nDownloading configuration files...', 'yellow', '⚙️  ');
  
  const files = [
    { remote: 'src/index.css', local: path.join(CONFIG.targetDir, 'src/index.css') },
    { remote: 'src/App.css', local: path.join(CONFIG.targetDir, 'src/App.css') },
    { remote: 'src/main.tsx', local: path.join(CONFIG.targetDir, 'src/main.tsx') },
    { remote: 'src/App.tsx', local: path.join(CONFIG.targetDir, 'src/App.tsx') },
    { remote: 'tailwind.config.ts', local: path.join(process.cwd(), 'tailwind.config.ts') },
    { remote: 'components.json', local: path.join(process.cwd(), 'components.json') },
    { remote: 'tsconfig.json', local: path.join(CONFIG.targetDir, 'tsconfig.json') }
  ];
  
  for (const { remote, local } of files) {
    try {
      const url = `${CONFIG.showcaseRawUrl}/${remote}`;
      const content = await fetchFile(url);
      
      const dir = path.dirname(local);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(local, content);
      log(`✓ ${remote}`, 'green', '  ');
    } catch (error) {
      log(`Warning: Could not download ${remote}`, 'yellow', '⚠️  ');
    }
  }
}

// Step 4: Merge package.json dependencies
async function mergeDependencies() {
  log('\nMerging dependencies...', 'yellow', '📦 ');
  
  try {
    const showcasePackageUrl = `${CONFIG.showcaseRawUrl}/package.json`;
    const showcasePackageContent = await fetchFile(showcasePackageUrl);
    const showcasePackage = JSON.parse(showcasePackageContent);
    
    const myWebsitePackagePath = path.join(process.cwd(), 'package.json');
    const myWebsitePackage = JSON.parse(fs.readFileSync(myWebsitePackagePath, 'utf8'));
    
    // Merge dependencies
    myWebsitePackage.dependencies = {
      ...myWebsitePackage.dependencies,
      ...showcasePackage.dependencies
    };
    
    myWebsitePackage.devDependencies = {
      ...myWebsitePackage.devDependencies,
      ...showcasePackage.devDependencies
    };
    
    // Add portfolio scripts if not present
    if (!myWebsitePackage.scripts['build:portfolio']) {
      myWebsitePackage.scripts['build:portfolio'] = 'vite build --config vite.portfolio.config.ts';
    }
    if (!myWebsitePackage.scripts['dev:portfolio']) {
      myWebsitePackage.scripts['dev:portfolio'] = 'vite --config vite.portfolio.config.ts';
    }
    
    // Set type to module if not set
    myWebsitePackage.type = 'module';
    
    fs.writeFileSync(myWebsitePackagePath, JSON.stringify(myWebsitePackage, null, 2) + '\n');
    log('Dependencies merged successfully', 'green', '✓ ');
    
    // Show added dependencies
    const newDeps = Object.keys(showcasePackage.dependencies || {}).filter(
      dep => !myWebsitePackage.dependencies?.[dep]
    );
    
    if (newDeps.length > 0) {
      log(`Added ${newDeps.length} new dependencies:`, 'blue', '  ');
      newDeps.slice(0, 5).forEach(dep => {
        log(`  - ${dep}`, 'dim', '  ');
      });
      if (newDeps.length > 5) {
        log(`  ... and ${newDeps.length - 5} more`, 'dim', '  ');
      }
    }
  } catch (error) {
    log(`Failed to merge dependencies: ${error.message}`, 'red', '❌ ');
    throw error;
  }
}

// Step 5: Create Vite config
async function createViteConfig() {
  log('\nCreating Vite configuration...', 'yellow', '⚙️  ');
  
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './portfolio_src',
  build: {
    outDir: '../public/portfolio_build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'portfolio_src/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './portfolio_src/src')
    }
  }
})
`;
  
  const configPath = path.join(process.cwd(), 'vite.portfolio.config.ts');
  fs.writeFileSync(configPath, viteConfig);
  log('Vite config created', 'green', '✓ ');
}

// Step 6: Create entry HTML
async function createEntryHTML() {
  log('\nCreating entry HTML...', 'yellow', '📄 ');
  
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio - Leon Madara</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  
  const htmlPath = path.join(CONFIG.targetDir, 'index.html');
  fs.writeFileSync(htmlPath, html);
  log('Entry HTML created', 'green', '✓ ');
}

// Step 7: Generate sync report
function generateReport() {
  log('\nGenerating sync report...', 'yellow', '📊 ');
  
  const report = {
    timestamp: new Date().toISOString(),
    success: true,
    filesSync  ed: [],
    warnings: [],
    errors: []
  };
  
  const reportPath = path.join(process.cwd(), '.github/LAST_SYNC_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log('Sync report saved', 'green', '✓ ');
}

// Main execution
async function main() {
  console.log('\n' + '='.repeat(60));
  log('Portfolio Synchronization Started', 'bright', '🚀 ');
  console.log('='.repeat(60) + '\n');
  
  const startTime = Date.now();
  
  try {
    await createDirectories();
    await downloadComponents();
    await downloadConfigFiles();
    await mergeDependencies();
    await createViteConfig();
    await createEntryHTML();
    generateReport();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    log(`Synchronization completed in ${duration}s`, 'green', '🎉 ');
    console.log('='.repeat(60) + '\n');
    
    log('Next steps:', 'blue', '📝 ');
    log('  1. Install dependencies: npm install', 'blue', '  ');
    log('  2. Build portfolio: npm run build:portfolio', 'blue', '  ');
    log('  3. Test locally: npm run dev:portfolio', 'blue', '  ');
    log('  4. Commit changes: git add . && git commit', 'blue', '  ');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    log(`Synchronization failed after ${duration}s`, 'red', '💥 ');
    console.log('='.repeat(60) + '\n');
    
    log('Error details:', 'red', '❌ ');
    console.error(error.message);
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
