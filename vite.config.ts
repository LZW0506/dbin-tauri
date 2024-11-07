import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import UnoCSS from 'unocss/vite'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [
		vue(),
		// 增加下面的配置项,这样在运行时就能检查eslint规范
		eslintPlugin(),
		UnoCSS(),
		vueDevTools(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			eslintrc: {
				enabled: true,
			},
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	resolve: {
		preserveSymlinks: true,
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				additionalData: '@use "@/style/globalVar.scss" as *;',
			},
		},
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**'],
		},
	},
}))
