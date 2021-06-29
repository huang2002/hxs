import { FunctionHandler, Utils } from '../common';
import { createFunctionHandler } from '../function';

const createIf = (ended: boolean): FunctionHandler => (
    createFunctionHandler(1, 1, (args, referer, context) => {
        const condition = args[0];
        if (typeof condition !== 'boolean') {
            Utils.raise(TypeError, 'expect a boolean as condition', referer, context);
        }
        return createFunctionHandler(1, 1, (_args, referer, context) => {
            const callback = _args[0];
            if (typeof callback !== 'function') {
                Utils.raise(TypeError, 'expect a callback', referer, context);
            }
            if (!ended && condition) {
                (callback as FunctionHandler)([], referer, context);
                return createIf(true);
            } else {
                return createIf(false);
            }
        });
    })
);

export const builtinIf = createIf(false);
