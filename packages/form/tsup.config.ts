import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  minify: false,
  clean: true,
  dts: true,
  target: 'esnext',
  format: ['esm'],
  tsconfig: 'tsconfig.build.json',
})
