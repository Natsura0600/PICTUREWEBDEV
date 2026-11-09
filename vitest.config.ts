import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': import.meta.dirname,
      // "server-only" corta la importación fuera de Next; en los tests no hace falta
      'server-only': path.join(import.meta.dirname, 'tests/unit/server-only-stub.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
