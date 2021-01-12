// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

const { join } = require('path');
const { execSync } = require('child_process');

const cliPath = join(__dirname, '../cli.js');

/**
 * @param {string} relativePath
 */
const runFile = (relativePath) => (
    execSync(`node ${cliPath} exec ${join(__dirname, relativePath)}`, { encoding: 'utf8' })
        .trim()
);

/**
 * @param {import('3h-test').TestContext} ctx
 */
exports.cliTests = ctx => {

    ctx.assertStrictEqual(runFile('./hello_world.hxs'), 'hello world');

};
