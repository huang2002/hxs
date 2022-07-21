// @ts-check
const { execSync } = require('child_process');

const CLI_PATH = '../../cli/index.js';

/**
 * @param {string} argString
 */
const execCLI = (argString) => (
    execSync(`node ${CLI_PATH} ${argString}`, { encoding: 'utf8' })
);

/**
 * @type {import('3h-test').TestCaseCallback}
 */
module.exports = (ctx) => {

    process.chdir(__dirname);

    ctx.assertDeepEqual(
        execCLI('exec ./main.hxs -m')
            .trim().split(/\r?\n/g),
        [
            'main start',
            'header0 start',
            'header1 start',
            'header1 imported header0',
            '0',
            'header1 end',
            'header0 imported header1',
            '3',
            'header0 end',
            'main imported header0',
            '3',
            '0',
            '1',
            'main imported header1',
            '3',
            '1',
            'main end',
        ]
    );

    ctx.assertDeepEqual(
        execCLI('exec ./hello_world.hxs ./header/header0.hxs -m')
            .trim().split(/\r?\n/g),
        [
            'hello world',
            'header0 start',
            'header1 start',
            'header1 imported header0',
            '0',
            'header1 end',
            'header0 imported header1',
            '3',
            'header0 end',
        ]
    );

};
