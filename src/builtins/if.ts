import { FunctionHandler, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { invoke, isInvocable } from '../function/common';

const createIf = (ended: boolean): FunctionHandler => Utils.injectHelp(
    'if (condition0) { ... } (condition1) { ... } ...',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const condition = args[0];
        if (typeof condition !== 'boolean') {
            Utils.raise(TypeError, 'expect a boolean as condition', referrer, context);
        }
        return createFunctionHandler(1, 1, (_args, referrer, context) => {
            const callback = _args[0];
            if (!isInvocable(callback)) {
                Utils.raise(TypeError, 'expect an invocable as callback', referrer, context);
            }
            if (!ended && condition) {
                invoke(callback, [], referrer, context, null);
                return createIf(true);
            } else {
                return createIf(false);
            }
        });
    })
);

export const builtinIf = createIf(false);
