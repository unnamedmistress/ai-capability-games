#!/usr/bin/env node
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

// Simple build script to replace vite
async function main() {
  // Build the JS bundle
  await build({
    entryPoints: ['./src/main.jsx'],
    bundle: true,
    outfile: './dist/assets/index.js',
    format: 'esm',
    jsx: 'automatic',
    jsxImportSource: 'react',
    loader: { '.jsx': 'jsx' },
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  // Copy index.html
  let html = fs.readFileSync('./index.html', 'utf8');
  html = html.replace('type="module" src="/src/main.jsx"', 'src="./assets/index.js"');
  
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }
  
  fs.writeFileSync('./dist/index.html', html);
  
  console.log('Build complete!');
}

main().catch(console.error);
