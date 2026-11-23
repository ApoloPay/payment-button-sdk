const fs = require('fs');
const path = require('path');

// Definir rutas (path.join se encarga de las barras / o \ según el OS)
const source = path.join(__dirname, '..', '..', 'ui', 'dist', 'nexora-smartpay.umd.js');
const destDir = path.join(__dirname, '..', 'assets');
const distDir = path.resolve(__dirname, '../dist');
const destFile = path.join(destDir, 'nexora-smartpay.js');

console.log('🔄 Iniciando copia de assets para WordPress...');

// 1. Crear carpeta 'dist' si no existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📂 Created dist directory');
}

// 2. Verificar que el build de UI exista
if (!fs.existsSync(source)) {
    console.error('❌ Error: No se encontró el build de UI.');
    console.error('   Asegúrate de haber corrido "turbo run build" en @nexora-smartpay/ui primero.');
    process.exit(1);
}

// 3. Crear carpeta assets si no existe
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 4. Copiar el archivo
try {
    fs.copyFileSync(source, destFile);
    console.log('✅ SDK copiado exitosamente a:', destFile);
} catch (err) {
    console.error('❌ Error al copiar:', err);
    process.exit(1);
}