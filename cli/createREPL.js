// @ts-check
const { createInterface } = require('readline');
const { Utils, evalCode, builtins, createFunctionHandler } = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);;

exports.createREPL = () => {

    const interface = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const store = new Map(builtins);

    store.set('__repl', Utils.injectHelp(
        'REPL manager',
        Utils.createDict({
            setPrompt: Utils.injectHelp(
                '__repl.setPrompt(str)',
                createFunctionHandler(1, 1, (args, referer, context) => {
                    if (typeof args[0] !== 'string') {
                        Utils.raise(TypeError, 'expect a string as prompt', referer, context);
                    }
                    interface.setPrompt(/** @type {string} */(args[0]));
                    return null;
                })
            ),
            exit: Utils.injectHelp(
                '__repl.exit()',
                createFunctionHandler(0, 0, () => {
                    process.exit(0);
                })
            ),
        })
    ));

    console.log('Entering REPL mode. Invoke `__repl.exit` to exit.\n');

    interface.prompt();
    interface.on('line', input => {
        try {
            console.log(
                Utils.toDisplay(
                    evalCode(input, {
                        store,
                        source: 'repl',
                    })
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
