// @ts-check
const { join } = require('path');
const { execSync } = require('child_process');

const CLI_PATH = join(__dirname, '../cli/index.js');
const TEST_FILE_PATH = join(__dirname, './hello_world.hxs');

/**
 * @param {string} path
 */
const execFile = (path) => (
    execSync(`node ${CLI_PATH} exec ${path}`, { encoding: 'utf8' })
);

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    ctx.assertStrictEqual(
        execFile(TEST_FILE_PATH)
            .trim(),
        'hello world'
    );

};
