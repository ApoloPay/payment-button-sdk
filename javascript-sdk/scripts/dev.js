const { spawn } = require('child_process');

const APP_MAP = {
  react: 'playground-react',
  vue: 'playground-vue',
  svelte: 'playground-svelte',
  angular: 'playground-angular',
  astro: 'playground-astro',
  vanilla: 'playground-vanilla',
};

// 2. (ej: ['react', 'vue'])
const args = process.argv.slice(2);

let filters = [];

if (args.length === 0) {
  console.log('🚀 Mode: Running ALL playgrounds...');
  filters = Object.values(APP_MAP).map(appName => `--filter=${appName}`);
} else {
  const selectedApps = args.map(arg => {
    const appName = APP_MAP[arg.toLowerCase()];
    if (!appName) {
      console.warn(`⚠️ Warning: Not found configuration for "${arg}". Ignored.`);
    }
    return appName;
  }).filter(Boolean);

  if (selectedApps.length === 0) {
    console.error('❌ Error: Valid application not choosen.');
    process.exit(1);
  }

  console.log(`🚀 Mode: running [${selectedApps.join(', ')}]...`);
  filters = selectedApps.map(appName => `--filter=${appName}`);
}

const command = 'pnpm';
const commandArgs = ['run', 'build', '&&', 'turbo', 'dev', ...filters];

const shell = process.platform === 'win32';

const child = spawn(command, commandArgs, { 
  stdio: 'inherit',
  shell: shell 
});

child.on('exit', (code) => {
  process.exit(code);
});