import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        host: '0.0.0.0',
        port: '4000',
        https: false,
        proxy: {
            '/draw': 'http://10.18.11.31:4100'
        }
    },
    build: {
        outDir: '../static-build/syao-static-backend',
        cssCodeSplit: false, // 启用之后拆分异步chunk的css，视情况开启
        emptyOutDir: true, // 清空打包目录的提醒
        brotliSize: false, // 压缩报告，开启消耗性能
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            },
            output: {
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: (chunkInfo) => {
                    let chunkName = 'assets/[name].[hash].js'
                    if (chunkInfo.isDynamicEntry) {
                        // 如果是异步加载的入口文件，根据文件路径来命名
                        if (chunkInfo.facadeModuleId.includes('.vue')) {
                            chunkName = chunkInfo.facadeModuleId.split('/src/')[1].replace(/\.vue$/, '').replace(/\/index$/, '').replace(/^views\//, '').replace(/\//g, '_')
                            chunkName = `assets/${chunkName}.[hash].js`
                        }
                    }
                    return chunkName
                },
                manualChunks: {
                    base: ['vue', 'vue-router', 'vuex', 'axios'],
                    element: ['element-plus']
                }
            }
        }
    }
})
