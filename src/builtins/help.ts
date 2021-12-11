import { Dict, FunctionHandler, Utils, HELP_SYMBOL } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const help = Utils.injectHelp(
    'help(target)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const target = args[0] as Dict | FunctionHandler;
        switch (typeof target) {
            case 'function':
            case 'object': {
                if (target && HELP_SYMBOL in target) {
                    return target[HELP_SYMBOL]!;
                }
                break;
            }
        }
        return 'no help available';
    })
);

export const injectHelp = Utils.injectHelp(
    'injectHelp(helpInfo, target)',
    createFunctionHandler(2, 2, (args, referrer, context) => {
        const helpInfo = args[0] as string;
        if (typeof helpInfo !== 'string') {
            Utils.raise(TypeError, 'expect a string as help info', referrer, context);
        }
        const target = args[1] as Dict | FunctionHandler;
        if (typeof target !== 'function' && !Utils.isDict(target)) {
            Utils.raise(TypeError, 'expect a dict or function as target', referrer, context);
        }
        target[HELP_SYMBOL] = helpInfo;
        return target;
    })
);
