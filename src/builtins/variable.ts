import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const exist = Utils.injectHelp(
    'exist(variableName)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        if (typeof args[0] !== 'string') {
            Utils.raise(TypeError, 'expect a string as variable name', referrer, context);
        }
        return context.store.has(args[0] as string);
    })
);

export const delete_ = Utils.injectHelp(
    'delete(variableName)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const name = args[0];
        if (typeof name !== 'string') {
            Utils.raise(TypeError, 'expect a string as variable name', referrer, context);
        }
        const { store } = context;
        if (!store.has(name as string)) {
            Utils.raise(ReferenceError, `"${name}" is not defined`, referrer, context);
        }
        store.delete(name as string);
        return null;
    })
);
