// @ts-check
const { Program } = require('3h-cli');

const program = new Program('hxs', {
    title: 'A simple programming language.',
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

        const HXS = /** @type {import('.')} */(
            /** @type {unknown} */(require('./dist/hxs.umd.js'))
        );;

        switch (args.actions[0]) {

            case 'exec': {
                const { readFileSync } = require('fs');
                const encoding = /** @type {import('crypto').Encoding} */(
                    args.getOption('--encoding')[0] || DEFAULT_ENCODING
                );
                const files = args.actions;
                for (let i = 1; i < files.length; i++) {
                    const filePath = files[i];
                    HXS.evalCode(
                        readFileSync(filePath, encoding),
                        undefined,
                        filePath,
                    );
                }
                break;
            }

            case 'repl': {
                const { createInterface } = require('readline');
                const interface = createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                const context = new Map(HXS.builtins);
                context.set('__repl', HXS.Common.createDict({
                    // __repl.setPrompt
                    setPrompt(rawArgs, context, env) {
                        const args = HXS.evalList(rawArgs, context, env.fileName);
                        HXS.Common.checkArgs(args, env, '__repl.setPrompt', 1, 1);
                        if (typeof args[0] !== 'string') {
                            HXS.Common.raise(TypeError, 'expect a string as prompt', env);
                        }
                        interface.setPrompt(args[0]);
                    },
                    // __repl.exit()
                    exit() {
                        interface.close();
                        process.exit(0);
                    },
                }));
                console.log('Entering REPL mode. Invoke `__repl.exit` to exit.\n');
                interface.prompt();
                interface.on('line', input => {
                    try {
                        console.log(HXS.evalCode(input, context, '<repl>'));
                        console.log();
                    } catch (error) {
                        console.error(error);
                        console.error();
                    }
                    interface.prompt();
                });
                break;
            }

            default: {
                throw new Error(
                    `unknown action: "${args.actions[0]}"`
                );
            }

        }

    });
