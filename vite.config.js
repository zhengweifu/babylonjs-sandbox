// vite.config.js
import { defineConfig } from 'vite'
import requireTransform from 'vite-plugin-require-transform';

import dns from 'dns'
dns.setDefaultResultOrder('verbatim')

module.exports = defineConfig({
    server:{
        host: 'localhost',
        port: 3000    
    },
    plugins: [
        requireTransform({}),
    ],
    define: {
        global: {}
    }
})