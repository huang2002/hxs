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
    name: '--module',
    alias: '-m',
    help: 'Enable module imports',
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

        const encoding = /** @type {BufferEncoding} */(
            args.getOption('--encoding')[0] || DEFAULT_ENCODING
        );

        const { actions } = args;

        switch (actions[0]) {

            case 'exec': {
                const { resolve } = require('path');
                const { exec } = require('./exec.js');
                const options = {
                    encoding,
                    module: args.options.has('--module'),
                };
                for (let i = 1; i < actions.length; i++) {
                    const filePath = resolve(process.cwd(), actions[i]);
                    exec(filePath, options);
                }
                break;
            }

            case 'repl': {
                const options = {
                    encoding,
                    module: args.options.has('--module'),
                };
                createREPL(options);
                break;
            }

            default: {
                throw new Error(
                    `unknown action: "${args.actions[0]}"`
                );
            }

        }

    });
