// @ts-check
const { Program } = require('3h-cli');
const { evalCode } = /** @type {import('.')} */(
    /** @type {unknown} */(require('./dist/hxs.umd.js'))
);;

const program = new Program('hxs', {
    title: 'A simple programming language.',
});

const DEFAULT_ENCODING = 'utf8';

program.action({
    name: 'exec <files...>',
    help: 'Execute the given script file(s)',
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

        if (args.options.has('--help')) {
            program.help();
            return;
        }

        if (args.actions.length) {
            switch (args.actions[0]) {
                case 'exec': {
                    const { readFileSync } = require('fs');
                    const encoding = /** @type {import('crypto').Encoding} */(
                        args.getOption('--encoding')[0] || DEFAULT_ENCODING
                    );
                    const files = args.actions;
                    for (let i = 1; i < files.length; i++) {
                        const filePath = files[i];
                        evalCode(
                            readFileSync(filePath, encoding),
                            undefined,
                            filePath,
                        );
                    }
                    break;
                }
                default: {
                    throw new Error(
                        `unknown action: "${args.actions[0]}"`
                    );
                }
            }
            return;
        }

    });
