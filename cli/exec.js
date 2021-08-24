// @ts-check
const { readFileSync } = require('fs');
const { dirname } = require('path');
const { enableModule } = require('./addons/module.js');
const HXS = /** @type {import('..')} */ (
    /** @type {unknown} */ (require('../dist/hxs.umd.js'))
);

/**
 * @typedef ExecOptions
 * @property {BufferEncoding} encoding
 * @property {boolean} module
 */

/**
 * @param {string} filePath
 * @param {ExecOptions} options
 */
exports.exec = (filePath, options) => {

    const code = readFileSync(filePath, options.encoding);

    /**
     * @type {HXS.ScriptContext}
     */
    const context = {
        store: HXS.Utils.createDict(HXS.builtins),
        exports: Object.create(null),
        resolvedModules: Object.create(null),
        source: filePath,
        basePath: dirname(filePath),
    };

    context.resolvedModules[filePath] = context.exports;

    if (options.module) {
        enableModule(context, options.encoding);
    }

    HXS.evalCode(code, context);

};
