import { Dict, Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const getExports = Utils.injectHelp(
    'getExports()',
    createFunctionHandler(0, 0, (args, referrer, context) => {
        return context.exports;
    })
);

export const export_ = Utils.injectHelp(
    'export(exports)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const exports = args[0] as Dict;
        if (!Utils.isDict(exports)) {
            Utils.raise(TypeError, `expect a dict as exports`, referrer, context);
        }
        Object.assign(context.exports, exports);
        return null;
    })
);

export const import_ = Utils.injectHelp(
    'import(path)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        Utils.raise(ReferenceError, `import is not implemented in current context`, referrer, context);
        return null;
    })
);
