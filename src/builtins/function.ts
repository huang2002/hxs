import { ContextValue, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { invoke, isInvocable } from '../index';

export const builtinFunction = Utils.injectHelp(
    'A dict providing methods for function manipulations.',
    Utils.createDict({

        isInvocable: Utils.injectHelp(
            'Function.isInvocable(target)',
            createFunctionHandler(1, 1, (args, referrer, context) => (
                isInvocable(args[0])
            ))
        ),

        invoke: Utils.injectHelp(
            'Function.invoke(invocable, args = null, thisArg = null)',
            createFunctionHandler(1, 3, (args, referrer, context) => {
                const fn = args[0];
                if (!isInvocable(fn)) {
                    Utils.raise(TypeError, 'expect an invocable to invoke', referrer, context);
                }
                const fnArgs = args.length > 1
                    ? args[1] as (ContextValue[]) | null
                    : null;
                if (fnArgs !== null && !Array.isArray(fnArgs)) {
                    Utils.raise(TypeError, 'expect an array or null as arguments', referrer, context);
                }
                const thisArg = args.length === 3 ? args[2] : null;
                return invoke(
                    fn,
                    fnArgs ? Utils.createRawArray(fnArgs, referrer) : [],
                    referrer,
                    context,
                    thisArg,
                );
            })
        ),

        bind: Utils.injectHelp(
            'Function.bind(invocable, thisArg)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const fn = args[0];
                if (!isInvocable(fn)) {
                    Utils.raise(TypeError, 'expect an invocable to bind', referrer, context);
                }
                return (_args, _referrer, _context) => {
                    return invoke(fn, _args, _referrer, _context, args[1]);
                };
            })
        ),

    })
);
