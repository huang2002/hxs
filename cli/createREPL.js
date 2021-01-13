// @ts-check
const { createInterface } = require('readline');
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);;

exports.createREPL = () => {

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

};
