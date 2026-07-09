import { defineConfig } from 'vitest/config'

// Rules + selectors are pure functions — a plain node environment is enough.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
