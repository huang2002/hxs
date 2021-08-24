// @ts-check
const { readFileSync, existsSync } = require('fs');
const { resolve, dirname } = require('path');
const HXS = /** @type {import('../..')} */(
    /** @type {unknown} */(require('../../dist/hxs.umd.js'))
);

const DEFAULT_ENCODING = 'utf8';

/**
 * @param {HXS.ScriptContext} context
 */
const enableModule = (context) => {

    context.store.import = HXS.Utils.injectHelp(
        `import(path, encoding = '${DEFAULT_ENCODING}')`,
        HXS.createFunctionHandler(1, 2, (args, referrer, _context) => {

            const path = /** @type {string} */(args[0]);
            if (typeof path !== 'string') {
                HXS.Utils.raise(TypeError, `expect a string as import path`, referrer, _context);
            }

            const encoding = (args.length > 1)
                ? /** @type {BufferEncoding} */(args[1])
                : DEFAULT_ENCODING;
            if (typeof encoding !== 'string') {
                HXS.Utils.raise(TypeError, `expect a string as target file encoding`, referrer, _context);
            }

            const modulePath = resolve(_context.basePath, path);

            const { resolvedModules } = _context;
            if (modulePath in resolvedModules) {
                return resolvedModules[modulePath];
            }

            if (!existsSync(modulePath)) {
                HXS.Utils.raise(ReferenceError, `${HXS.Utils.toDisplay(modulePath)} does not exist`, referrer, context);
            }

            const code = readFileSync(modulePath, encoding);

            const exports = Object.create(null);
            resolvedModules[modulePath] = exports;

            /**
             * @type {HXS.ScriptContext}
             */
            const moduleContext = {
                store: HXS.Utils.createDict(HXS.builtins),
                exports,
                resolvedModules,
                source: modulePath,
                basePath: dirname(modulePath),
            };

            enableModule(moduleContext);
            HXS.evalCode(code, moduleContext);

            return exports;

        })
    );

};

exports.enableModule = enableModule;
