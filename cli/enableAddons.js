const { enableModule } = require('./addons/module.js');

// @ts-check
const HXS = /** @type {import('..')} */(
    /** @type {unknown} */(require('../dist/hxs.umd.js'))
);

/**
 * @typedef AddonOptions
 * @property {BufferEncoding} encoding
 * @property {boolean} module
 */

/**
 * @param {HXS.ScriptContext} context
 * @param {AddonOptions} options
 */
exports.enableAddons = (context, options) => {

    if (options.module) {
        enableModule(context, options.encoding);
    }

};
