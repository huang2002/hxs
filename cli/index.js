#!/usr/bin/env node
// @ts-check
const { Program } = require('3h-cli');
const { createREPL } = require("./createREPL");

const program = new Program('hxs', {
    title: require('../package.json').description,
});

const DEFAULT_ENCODING = 'utf8';

program.action({
    name: 'exec <files...>',
    help: 'Execute the given script file(s)',
});

program.action({
    name: 'repl',
    help: 'Start REPL mode in command line',
});

program.option({
    name: '--encoding',
    alias: '-e',
    value: '<value>',
    help: `The encoding of input file (default: ${DEFAULT_ENCODING})`,
});

program.option({
    name: '--help',
    alias: '-h',
    help: 'Print help info',
});

program.parse(process.argv)
    .then(args => {

        if (
            args.options.has('--help')
            || !(args.actions.length + args.options.size + args.rest.length)
        ) {
            program.help();
            return;
        }

        if (!args.actions.length) {
            throw new Error('no actions specified');
        }


        switch (args.actions[0]) {

            case 'exec': {
                const { readFileSync } = require('fs');
                const { evalCode } = /** @type {import('..')} */(
                    /** @type {unknown} */(require('../dist/hxs.umd.js'))
                );;
                const encoding = /** @type {import('crypto').Encoding} */(
                    args.getOption('--encoding')[0] || DEFAULT_ENCODING
                );
                const files = args.actions;
                for (let i = 1; i < files.length; i++) {
                    const filePath = files[i];
                    evalCode(
                        readFileSync(filePath, encoding),
                        {
                            source: filePath,
                        }
                    );
                }
                break;
            }

            case 'repl': {
                createREPL();
                break;
            }

            default: {
                throw new Error(
                    `unknown action: "${args.actions[0]}"`
                );
            }

        }

    });
