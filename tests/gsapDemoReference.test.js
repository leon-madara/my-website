// Jest test to ensure no demo GSAP SplitText references remain in the project
const fs = require('fs');
const path = require('path');

// Directory to scan (project root)
const projectRoot = path.resolve(__dirname, '..');

// File extensions to include
const includeExtensions = ['.js', '.html', '.css', '.json'];

// Known demo patterns (example URLs or filenames)
const demoPatterns = [
    /s\.cdpn\.io\/16327\/SplitText/i,
    /assets\.codepen\.io\/16327\/SplitText/i,
    /SplitText.*demo/i,
    /trial.*SplitText/i
];

function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip node_modules, .git, and tests directories
            if (['node_modules', '.git', 'dist', 'build', 'tests'].includes(entry.name)) continue;
            scanDirectory(fullPath);
        } else if (entry.isFile()) {
            // Skip the test file itself
            if (fullPath === __filename) continue;
            const ext = path.extname(entry.name).toLowerCase();
            if (!includeExtensions.includes(ext)) continue;
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const pattern of demoPatterns) {
                if (pattern.test(content)) {
                    throw new Error(`Demo GSAP reference found in ${fullPath}`);
                }
            }
        }
    }
}

test('No demo GSAP SplitText references exist', () => {
    expect(() => scanDirectory(projectRoot)).not.toThrow();
});
