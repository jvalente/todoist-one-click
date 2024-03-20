// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'

const devBrowser = process.env.DEV_BROWSER || 'chrome'

export default {
    input: ['src/background.ts', 'src/views/settings/settings.ts'],
    output: {
        dir: 'dist',
        format: 'es',
    },
    plugins: [
        typescript(),
        nodeResolve(),
        copy({
            targets: [
                { src: 'assets/icons', dest: 'dist' },
                {
                    src: `assets/manifest/manifest.${devBrowser}.json`,
                    dest: 'dist',
                    rename: 'manifest.json',
                },
                { src: 'src/html/*', dest: 'dist' },
            ],
        }),
    ],
}
