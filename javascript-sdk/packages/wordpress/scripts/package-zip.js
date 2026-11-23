const fs = require('fs');
const path = require('path');
const zip = require('bestzip');

// WordPress installs a zip into wp-content/plugins/<top-level folder>/. With the
// files at the zip root it would fall back to the zip's file name instead, so a
// renamed (e.g. versioned) zip would install as a different plugin and lose its
// settings. The zip therefore holds a single folder named after the plugin slug.
const SLUG = 'apolopay-checkout-for-woocommerce';
const FILES = ['apolo-pay.php', 'includes', 'assets', 'languages', 'readme.txt'];

const pluginDir = path.resolve(__dirname, '..');
const distDir = path.join(pluginDir, 'dist');
const stageDir = path.join(distDir, SLUG);
const zipName = `${SLUG}.zip`;

async function main() {
  fs.rmSync(stageDir, { recursive: true, force: true });
  fs.rmSync(path.join(distDir, zipName), { force: true });
  fs.mkdirSync(stageDir, { recursive: true });

  for (const entry of FILES) {
    const source = path.join(pluginDir, entry);
    if (!fs.existsSync(source)) {
      throw new Error(`Missing plugin file: ${entry}`);
    }
    fs.cpSync(source, path.join(stageDir, entry), { recursive: true });
  }

  await zip({ source: SLUG, destination: zipName, cwd: distDir });
  console.log(`Plugin zip created: ${path.join(distDir, zipName)}`);
}

main().catch((err) => {
  console.error('Error creating the plugin zip:', err);
  process.exit(1);
});
