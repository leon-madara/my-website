#!/usr/bin/env node

/**
 * Portfolio Showcase Synchronization Script
 * 
 * Automatically syncs design components from portfolio-showcase to my-website
 * Runs tests, builds, and deploys if all checks pass
 * 
 * Usage:
 *   node scripts/sync-portfolio.js [--dry-run] [--skip-tests] [--skip-deploy]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.bright}${colors.blue}▶${colors.reset} ${msg}\n`)
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const skipTests = args.includes('--skip-tests');
const skipDeploy = args.includes('--skip-deploy');

// Load configuration
const configPath = path.join(__dirname, '../.sync-config.json');
if (!fs.existsSync(configPath)) {
  log.error('Configuration file not found: .sync-config.json');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Statistics
const stats = {
  filesDownloaded: 0,
  filesSynced: 0,
  testsRun: 0,
  errors: []
};

/**
 * Download file from GitHub
 */
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          stats.filesDownloaded++;
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Fetch directory tree from GitHub API
 */
function fetchGitHubTree(repo, path = '') {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const options = {
      headers: {
        'User-Agent': 'portfolio-sync-script'
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Recursively sync directory from source to target
 */
async function syncDirectory(sourcePath, targetPath) {
  log.info(`Syncing ${sourcePath} → ${targetPath}`);
  
  try {
    const items = await fetchGitHubTree(config.sourceRepo, sourcePath);
    
    if (!Array.isArray(items)) {
      throw new Error('Invalid response from GitHub API');
    }

    // Create target directory if it doesn't exist
    const targetDir = path.join(__dirname, '..', targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const item of items) {
      const targetFile = path.join(targetDir, item.name);
      
      if (item.type === 'file') {
        if (!isDryRun) {
          await downloadFile(item.download_url, targetFile);
        }
        log.success(`Synced: ${item.name}`);
        stats.filesSynced++;
      } else if (item.type === 'dir') {
        await syncDirectory(item.path, path.join(targetPath, item.name));
      }
    }
  } catch (error) {
    log.error(`Failed to sync ${sourcePath}: ${error.message}`);
    stats.errors.push({ path: sourcePath, error: error.message });
  }
}

/**
 * Run command and capture output
 */
function runCommand(command, description) {
  log.info(`Running: ${description}`);
  
  if (isDryRun) {
    log.warning(`[DRY RUN] Would execute: ${command}`);
    return { success: true, output: 'Dry run - not executed' };
  }

  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    log.success(description);
    return { success: true, output };
  } catch (error) {
    log.error(`${description} failed`);
    stats.errors.push({ command, error: error.message });
    return { success: false, output: error.message };
  }
}

/**
 * Main sync process
 */
async function main() {
  console.log(`\n${colors.bright}Portfolio Showcase Sync${colors.reset}`);
  console.log('═'.repeat(50));
  
  if (isDryRun) {
    log.warning('Running in DRY RUN mode - no files will be modified\n');
  }

  // Step 1: Sync files from portfolio-showcase
  log.step('Step 1: Syncing files from portfolio-showcase');
  
  for (const [key, paths] of Object.entries(config.syncPaths)) {
    await syncDirectory(paths.source, paths.target);
  }

  // Step 2: Install dependencies
  log.step('Step 2: Installing dependencies');
  runCommand(config.buildConfig.installCommand, 'Install dependencies');

  // Step 3: Run tests
  if (!skipTests && config.automation.autoTest) {
    log.step('Step 3: Running tests');
    const testResult = runCommand(config.buildConfig.testCommand, 'Run tests');
    
    if (!testResult.success) {
      log.error('Tests failed! Aborting sync.');
      printSummary(false);
      process.exit(1);
    }
    stats.testsRun++;
  } else {
    log.warning('Skipping tests');
  }

  // Step 4: Build project
  log.step('Step 4: Building project');
  const buildResult = runCommand(config.buildConfig.buildCommand, 'Build project');
  
  if (!buildResult.success) {
    log.error('Build failed! Aborting sync.');
    printSummary(false);
    process.exit(1);
  }

  // Step 5: Commit changes
  if (config.automation.autoCommit && !isDryRun) {
    log.step('Step 5: Committing changes');
    runCommand('git add .', 'Stage changes');
    runCommand(
      `git commit -m "chore: sync portfolio components from showcase [${new Date().toISOString()}]"`,
      'Commit changes'
    );
    runCommand('git push origin main', 'Push changes');
  } else {
    log.warning('Skipping commit');
  }

  // Step 6: Deploy to Cloudflare
  if (!skipDeploy && config.automation.autoDeploy && !isDryRun) {
    log.step('Step 6: Deploying to Cloudflare');
    const deployResult = runCommand(config.deployConfig.deployCommand, 'Deploy to Cloudflare');
    
    if (!deployResult.success) {
      log.error('Deployment failed!');
      printSummary(false);
      process.exit(1);
    }
  } else {
    log.warning('Skipping deployment');
  }

  printSummary(true);
}

/**
 * Print summary of sync process
 */
function printSummary(success) {
  console.log('\n' + '═'.repeat(50));
  console.log(`${colors.bright}Sync Summary${colors.reset}\n`);
  
  console.log(`Files Downloaded: ${colors.cyan}${stats.filesDownloaded}${colors.reset}`);
  console.log(`Files Synced: ${colors.cyan}${stats.filesSynced}${colors.reset}`);
  console.log(`Tests Run: ${colors.cyan}${stats.testsRun}${colors.reset}`);
  console.log(`Errors: ${stats.errors.length > 0 ? colors.red : colors.green}${stats.errors.length}${colors.reset}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n${colors.red}Errors:${colors.reset}`);
    stats.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.path || err.command}: ${err.error}`);
    });
  }
  
  if (success) {
    console.log(`\n${colors.green}${colors.bright}✓ Sync completed successfully!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}✗ Sync failed!${colors.reset}`);
  }
  
  console.log('═'.repeat(50) + '\n');
}

// Run the sync process
main().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
