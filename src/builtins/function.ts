import { SymbolNode } from '3h-ast';
import { ContextValue, SyntaxNode, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinFunction = Utils.injectHelp(
    'A dict providing methods for function manipulations.',
    Utils.createDict({

        isInvocable: Utils.injectHelp(
            'Function.isInvocable(target)',
            createFunctionHandler(1, 1, (args, referrer, context) => (
                Utils.isInvocable(args[0])
            ))
        ),

        invoke: Utils.injectHelp(
            'Function.invoke(invocable, args = null, thisArg = null)',
            createFunctionHandler(1, 3, (args, referrer, context) => {
                const fn = args[0];
                if (!Utils.isInvocable(fn)) {
                    Utils.raise(TypeError, 'expect an invocable to invoke', referrer, context);
                }
                const fnArgs = args.length > 1 ? args[1] as (ContextValue[]) | null : null;
                if (fnArgs !== null && !Array.isArray(fnArgs)) {
                    Utils.raise(TypeError, 'expect an array or null as arguments', referrer, context);
                }
                const _fnArgs: SyntaxNode[] = [];
                if (fnArgs) {
                    const COMMA_NODE: SymbolNode = {
                        type: 'symbol',
                        value: ',',
                        line: referrer.line,
                        column: referrer.column,
                        offset: referrer.offset,
                    };
                    for (let i = 0; i < fnArgs.length; i++) {
                        if (i > 0) {
                            _fnArgs.push(COMMA_NODE);
                        }
                        _fnArgs.push(
                            Utils.createValueNode(fnArgs[i], referrer)
                        );
                    }
                }
                const thisArg = args.length === 3 ? args[2] : null;
                return Utils.invoke(fn, _fnArgs, referrer, context, thisArg);
            })
        ),

        bind: Utils.injectHelp(
            'Function.bind(invocable, thisArg)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const fn = args[0];
                if (!Utils.isInvocable(fn)) {
                    Utils.raise(TypeError, 'expect an invocable to bind', referrer, context);
                }
                return (_args, _referrer, _context) => {
                    return Utils.invoke(fn, _args, _referrer, _context, args[1]);
                };
            })
        ),

    })
);
