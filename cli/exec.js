// @ts-check
const { readFileSync } = require('fs');
const { dirname } = require('path');
const { enableAddons } = require('./enableAddons.js');
const HXS = /** @type {import('..')} */ (
    /** @type {unknown} */ (require('../dist/hxs.umd.js'))
);

/**
 * @param {string} filePath
 * @param {import('./enableAddons').AddonOptions} options
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
        stack: [],
    };

    context.resolvedModules[filePath] = context.exports;

    enableAddons(context, options);

    HXS.evalCode(code, context);

};
