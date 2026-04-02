const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const OUTPUT_DIR = path.join(__dirname, 'visual-diff');

const viewports = [
  { name: 'desktop', label: 'Desktop (1920×1080)' },
  { name: 'mobile', label: 'Mobile (375×667)' }
];

const results = fs.existsSync(path.join(__dirname, 'diff-result.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'diff-result.json'), 'utf8'))
  : { desktop: 0, mobile: 0 };

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getImageBase64(imagePath) {
  if (!fs.existsSync(imagePath)) return null;
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mimeType};base64,${fs.readFileSync(imagePath).toString('base64')}`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Diff Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      padding: 40px;
      min-height: 100vh;
    }
    h1 {
      color: #58a6ff;
      margin-bottom: 8px;
      font-size: 28px;
    }
    .subtitle {
      color: #8b949e;
      margin-bottom: 40px;
    }
    .viewport-section {
      margin-bottom: 60px;
    }
    .viewport-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #30363d;
    }
    .viewport-label {
      font-size: 20px;
      font-weight: 600;
      color: #58a6ff;
    }
    .diff-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .diff-badge.no-changes {
      background: rgba(46, 160, 67, 0.2);
      color: #3fb950;
    }
    .diff-badge.has-changes {
      background: rgba(210, 153, 34, 0.2);
      color: #d29922;
    }
    .comparison-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .comparison-item {
      background: #161b22;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #30363d;
    }
    .comparison-item h3 {
      color: #8b949e;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .comparison-item img {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #30363d;
    }
    .missing {
      color: #f85149;
      font-size: 14px;
      padding: 40px;
      text-align: center;
      background: #161b22;
      border-radius: 8px;
    }
    .summary {
      background: #161b22;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
      border: 1px solid #30363d;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background: #0d1117;
      border-radius: 6px;
    }
    .summary-label {
      color: #8b949e;
    }
    .summary-value {
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>📸 Visual Change Analysis</h1>
  <p class="subtitle">Automated screenshot comparison for PR visual regression testing</p>

  <div class="summary">
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-label">Desktop Difference</span>
        <span class="summary-value">${results.desktop >= 0 ? results.desktop.toFixed(2) + '%' : 'N/A'}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Mobile Difference</span>
        <span class="summary-value">${results.mobile >= 0 ? results.mobile.toFixed(2) + '%' : 'N/A'}</span>
      </div>
    </div>
  </div>

  ${viewports.map(vp => {
    const prodImg = getImageBase64(path.join(SCREENSHOTS_DIR, 'production', `production-${vp.name}.png`));
    const stagImg = getImageBase64(path.join(SCREENSHOTS_DIR, 'staging', `staging-${vp.name}.png`));
    const diffImg = getImageBase64(path.join(SCREENSHOTS_DIR, 'diff', `diff-${vp.name}.png`));
    const diffPct = results[vp.name] || 0;
    const hasChanges = diffPct >= 0.5;

    return `
    <div class="viewport-section">
      <div class="viewport-header">
        <span class="viewport-label">${vp.label}</span>
        <span class="diff-badge ${hasChanges ? 'has-changes' : 'no-changes'}">
          ${hasChanges ? '⚠️ Changes detected' : '✅ No changes'}
        </span>
      </div>
      <div class="comparison-row">
        <div class="comparison-item">
          <h3>Production (Before)</h3>
          ${prodImg ? `<img src="${prodImg}" alt="Production ${vp.name}">` : '<div class="missing">No screenshot</div>'}
        </div>
        <div class="comparison-item">
          <h3>Staging (After)</h3>
          ${stagImg ? `<img src="${stagImg}" alt="Staging ${vp.name}">` : '<div class="missing">No screenshot</div>'}
        </div>
        <div class="comparison-item">
          <h3>Diff</h3>
          ${diffImg ? `<img src="${diffImg}" alt="Diff ${vp.name}">` : '<div class="missing">No diff</div>'}
        </div>
      </div>
    </div>
    `;
  }).join('')}
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);

const assets = ['production', 'staging', 'diff'];
for (const dir of assets) {
  const srcDir = path.join(SCREENSHOTS_DIR, dir);
  if (fs.existsSync(srcDir)) {
    for (const file of fs.readdirSync(srcDir)) {
      fs.copyFileSync(path.join(srcDir, file), path.join(OUTPUT_DIR, file));
    }
  }
}

console.log('✅ HTML report generated!');
console.log(`📁 Output: ${OUTPUT_DIR}/index.html`);