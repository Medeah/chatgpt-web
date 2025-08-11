import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'
import dsv from '@rollup/plugin-dsv'

import purgecss from '@fullhuman/postcss-purgecss'

const plugins = [svelte(), dsv()]

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // Only run PurgeCSS in production builds
  const common = {
    plugins,
    resolve: {
      alias: {
        'svelte-modals': path.resolve(__dirname, 'src/lib/shims/svelte-modals/index.ts')
      }
    }
  }
  if (command === 'build') {
    return {
      ...common,
      css: {
        postcss: {
          plugins: [
            purgecss({
              content: ['./**/*.html', './**/*.svelte'],
              safelist: ['pre', 'code']
            })
          ]
        }
      },
      base: './'
    }
  }
  return common
})
