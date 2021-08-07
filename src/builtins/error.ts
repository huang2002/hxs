import { WordNode } from '3h-ast';
import { FunctionHandler, Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const builtinRaise = Utils.injectHelp(
    'raise(error_message)',
    createFunctionHandler(1, 1, (args, referrer, context) => {
        const message = args[0] as string;
        if (typeof message !== 'string') {
            Utils.raise(TypeError, 'expect a string as error message', referrer, context);
        }
        throw message;
    })
);

export const builtinTry = Utils.injectHelp(
    'try { ... } (error) { ... }',
    createFunctionHandler(1, 1, (args, referrer, context, thisArg): FunctionHandler => {

        const tryBody = args[0] as FunctionHandler;
        if (typeof tryBody !== 'function') {
            Utils.raise(TypeError, 'expect a callback to execute', referrer, context);
        }

        return (rawArgs) => {

            if (rawArgs.length > 1 || rawArgs[0].type !== 'word') {
                Utils.raise(TypeError, 'expect a word as the name for error', referrer, context);
            }
            const errName = (rawArgs[0] as WordNode).value;

            return createFunctionHandler(1, 1, (_args, _referrer, _context, _thisArg) => {

                const catchBody = _args[0] as FunctionHandler;
                if (typeof catchBody !== 'function') {
                    Utils.raise(TypeError, 'expect a callback as error handler', referrer, context);
                }

                try {
                    tryBody([], referrer, context, thisArg);
                } catch (error) {
                    Utils.injectTemp(_context.store, {
                        [errName]: String(error),
                    }, () => {
                        catchBody([], _referrer, _context, _thisArg);
                    });
                }

                return null;

            });

        };

    })
);
