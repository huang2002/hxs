import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const exist = Utils.injectHelp(
    'exist(variableName)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const name = args[0] as string;
        if (typeof name !== 'string') {
            Utils.raise(TypeError, 'expect a string as variable name', referrer, context);
        }
        return name in context.store;
    })
);

export const delete_ = Utils.injectHelp(
    'delete(variableName)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const name = args[0] as string;
        if (typeof name !== 'string') {
            Utils.raise(TypeError, 'expect a string as variable name', referrer, context);
        }
        const { store } = context;
        if (!(name in store)) {
            Utils.raise(ReferenceError, `"${name}" is not defined`, referrer, context);
        }
        delete store[name];
        return null;
    })
);

export const getContextStore = Utils.injectHelp(
    'getContextStore()',
    createFunctionHandler(0, 0, (args, referrer, context) => {
        return context.store;
    })
);
