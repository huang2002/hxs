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
        setPrompt: HXS.Common.injectHelp(
            '__repl.setPrompt(str)',
            (rawArgs, context, env) => {
                const args = HXS.evalList(rawArgs, context, env.fileName);
                HXS.Common.checkArgs(args, env, '__repl.setPrompt', 1, 1);
                if (typeof args[0] !== 'string') {
                    HXS.Common.raise(TypeError, 'expect a string as prompt', env);
                }
                interface.setPrompt(args[0]);
            }
        ),
        exit: HXS.Common.injectHelp(
            '__repl.exit()',
            () => {
                process.exit(0);
            }
        ),
    }));

    console.log('Entering REPL mode. Invoke `__repl.exit` to exit.\n');

    interface.prompt();
    interface.on('line', input => {
        try {
            console.log(
                HXS.Common.toString(
                    HXS.evalCode(input, context, '<repl>')
                )
            );
            console.log();
        } catch (error) {
            console.error('Error: ' + error.message);
            console.error();
        }
        interface.prompt();
    });

};
