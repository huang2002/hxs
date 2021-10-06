// @ts-check
const { createInterface } = require('readline');
const { enableAddons } = require('./enableAddons.js');
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

/**
 * @typedef REPLOptions
 * @property {BufferEncoding} encoding
 * @property {boolean} module
 */

/**
 * @param {REPLOptions} options
 */
exports.createREPL = (options) => {

    const interface = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    /**
     * @type {import('..').ScriptContext}
     */
    const context = {
        store: HXS.Utils.createDict(HXS.builtins),
        exports: Object.create(null),
        resolvedModules: Object.create(null),
        source: 'repl',
        basePath: process.cwd(),
    };

    enableAddons(context, options);

    context.store.__repl = HXS.Utils.injectHelp(
        'REPL manager',
        HXS.Utils.createDict({
            setPrompt: HXS.Utils.injectHelp(
                '__repl.setPrompt(str)',
                HXS.createFunctionHandler(1, 1, (args, referer, _context) => {
                    if (typeof args[0] !== 'string') {
                        HXS.Utils.raise(TypeError, 'expect a string as prompt', referer, _context);
                    }
                    interface.setPrompt(/** @type {string} */(args[0]));
                    return null;
                })
            ),
            exit: HXS.Utils.injectHelp(
                '__repl.exit()',
                HXS.createFunctionHandler(0, 0, () => {
                    process.exit(0);
                })
            ),
        })
    );

    console.log('Entering REPL mode. Invoke `__repl.exit` to exit.\n');

    interface.prompt();
    interface.on('line', input => {
        try {
            console.log(
                HXS.Utils.toDisplay(
                    HXS.evalCode(input, context)
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
