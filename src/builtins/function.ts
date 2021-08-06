import { SymbolNode } from '3h-ast';
import { ContextValue, FunctionHandler, SyntaxNode, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinFunction = Utils.injectHelp(
    'A dict providing methods for function manipulations.',
    Utils.createDict({

        invoke: Utils.injectHelp(
            'Function.invoke(function, args, thisArg = null)',
            createFunctionHandler(2, 3, (args, referrer, context) => {
                const fn = args[0];
                if (typeof fn !== 'function') {
                    Utils.raise(TypeError, 'expect a function to invoke', referrer, context);
                }
                const fnArgs = args[1] as ContextValue[];
                if (!Array.isArray(fnArgs)) {
                    Utils.raise(TypeError, 'expect an array as arguments', referrer, context);
                }
                const _fnArgs: SyntaxNode[] = [];
                for (let i = 0; i < fnArgs.length; i++) {
                    const commaNode: SymbolNode = {
                        type: 'symbol',
                        value: ',',
                        line: referrer.line,
                        column: referrer.column,
                        offset: referrer.offset,
                    };
                    _fnArgs.push(
                        Utils.createValueNode(fnArgs[i], referrer)
                    );
                    _fnArgs.push(commaNode);
                }
                const thisArg = args.length === 3 ? args[2] : null;
                return (fn as FunctionHandler)(_fnArgs, referrer, context, thisArg);
            })
        ),

        bind: Utils.injectHelp(
            'Function.bind(function, thisArg)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const fn = args[0];
                if (typeof fn !== 'function') {
                    Utils.raise(TypeError, 'expect a function to bind', referrer, context);
                }
                return (_args, _referrer, _context) => {
                    return (fn as FunctionHandler)(_args, _referrer, _context, args[1]);
                };
            })
        ),

    })
);
