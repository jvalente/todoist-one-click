// rollup.config.js
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import archiver from 'archiver'
import copy from 'rollup-plugin-copy'

const PACKAGE_DIR = 'packages'

const devBrowser = process.env.DEV_BROWSER || 'chrome'
const build = process.env.BUILD || 'production'

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
        makeSourcePackage(),
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
        }
        throw new Error()
    } catch {
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
            if (build === 'development') return
            if (!fs.existsSync(PACKAGE_DIR)) fs.mkdirSync(PACKAGE_DIR)

            return new Promise((resolve) => {
                const path = `${PACKAGE_DIR}/tdoneclick-${devBrowser}-${version}.zip`
                const output = fs.createWriteStream(path)

                output.on('finish', () => {
                    printPackageSize(path, devBrowser)
                    resolve()
                })

                const archive = archiver('zip', { zlib: { level: 1 } })
                // biome-ignore lint/suspicious/noConsole: dev tools
                archive.on('warning', console.log)
                // biome-ignore lint/suspicious/noConsole: dev tools
                archive.on('error', console.log)

                archive.pipe(output)
                archive.directory('dist/', false)
                archive.finalize()
            })
        },
    }
}

/**
 * Bundle git-tracked source files into a zip for Firefox add-on review
 */
function makeSourcePackage() {
    return {
        name: 'make-source-package',
        writeBundle() {
            if (build === 'development' || devBrowser !== 'firefox') return
            if (!fs.existsSync(PACKAGE_DIR)) fs.mkdirSync(PACKAGE_DIR)

            return new Promise((resolve) => {
                const path = `${PACKAGE_DIR}/tdoneclick-source-${version}.zip`
                const output = fs.createWriteStream(path)

                output.on('finish', () => {
                    printPackageSize(path, 'source')
                    resolve()
                })

                const archive = archiver('zip', { zlib: { level: 9 } })
                // biome-ignore lint/suspicious/noConsole: dev tools
                archive.on('warning', console.log)
                // biome-ignore lint/suspicious/noConsole: dev tools
                archive.on('error', console.log)

                archive.pipe(output)

                const files = execSync('git ls-files', { encoding: 'utf-8' })
                    .trim()
                    .split('\n')

                for (const file of files) {
                    archive.file(file, { name: file })
                }

                archive.finalize()
            })
        },
    }
}

function printPackageSize(path, label) {
    const name = label || devBrowser
    // biome-ignore lint/suspicious/noConsole: dev tools
    console.log(
        `\x1b[33m\x1b[1m\x1b[4m${name} package: ${Math.round(
            fs.statSync(path).size / 1024,
        )}KB\x1b[0m`,
    )
}
