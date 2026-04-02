const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const fs = require('fs');
const path = require('path');

const PRODUCTION_DIR = path.join(__dirname, 'screenshots', 'production');
const STAGING_DIR = path.join(__dirname, 'screenshots', 'staging');
const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'diff');

const viewports = ['desktop', 'mobile'];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function loadImage(imagePath) {
  return new Promise((resolve, reject) => {
    const buffer = fs.readFileSync(imagePath);
    PNG.sync.read(buffer, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function saveDiffImage(diffData, width, height, outputPath) {
  const png = new PNG({ width, height });
  png.data = diffData;
  png.pack().pipe(fs.createWriteStream(outputPath));
}

async function compareImages() {
  const results = {};

  for (const viewport of viewports) {
    const prodPath = path.join(PRODUCTION_DIR, `production-${viewport}.png`);
    const stagPath = path.join(STAGING_DIR, `staging-${viewport}.png`);
    const diffPath = path.join(OUTPUT_DIR, `diff-${viewport}.png`);

    console.log(`\n🔍 Comparing ${viewport}...`);

    if (!fs.existsSync(prodPath)) {
      console.log(`  ⚠️ Production screenshot not found: ${prodPath}`);
      results[viewport] = -1;
      continue;
    }

    if (!fs.existsSync(stagPath)) {
      console.log(`  ⚠️ Staging screenshot not found: ${stagPath}`);
      results[viewport] = -1;
      continue;
    }

    const img1 = PNG.sync.read(fs.readFileSync(prodPath));
    const img2 = PNG.sync.read(fs.readFileSync(stagPath));

    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);

    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      { width, height, threshold: 0.1, alpha: 0.1, antialiased: false, diffColor: [255, 0, 0] }
    );

    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    console.log(`  📊 ${diffPercentage.toFixed(2)}% pixels different`);
    console.log(`  💾 Saved diff: ${diffPath}`);

    results[viewport] = diffPercentage;
  }

  fs.writeFileSync(
    path.join(__dirname, 'diff-result.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n✅ Comparison complete!');
  console.log(`📄 Results saved to: ${path.join(__dirname, 'diff-result.json')}`);
}

compareImages().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});