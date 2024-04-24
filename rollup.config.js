// rollup.config.js
import fs from 'fs'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import archiver from 'archiver'

const PACKAGE_DIR = 'packages'

const devBrowser = process.env.DEV_BROWSER || 'chrome'
const version = getVersion()

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
                    transform: applyVersionToManifest,
                },
                { src: 'src/html/*', dest: 'dist' },
            ],
        }),
        makePackage(),
    ],
}

/**
 * Get the version from package.json
 */
function getVersion() {
    const versionFormat = /^\d+\.\d+\.\d+$/

    try {
        const version = JSON.parse(fs.readFileSync('package.json')).version
        if (versionFormat.test(version)) {
            return version
        } else {
            throw new Error()
        }
    } catch (error) {
        throw new Error('Could not read version from')
    }
}

/**
 * Apply package.json version to manifest.json
 */
function applyVersionToManifest(contents) {
    return contents.toString().replace('__VERSION__', version)
}

/**
 * Compress the dist folder into a packages/ zip file
 */
function makePackage() {
    return {
        name: 'make-package',
        writeBundle() {
            if (!fs.existsSync(PACKAGE_DIR)) fs.mkdirSync(PACKAGE_DIR)

            return new Promise((resolve) => {
                const output = fs.createWriteStream(
                    `${PACKAGE_DIR}/tdoneclick-${devBrowser}-${version}.zip`
                )
                output.on('finish', resolve)

                const archive = archiver('zip', { zlib: { level: 1 } })
                archive.on('warning', console.log)
                archive.on('error', console.log)

                archive.pipe(output)
                archive.directory('dist/', false)
                archive.finalize()
            })
        },
    }
}
