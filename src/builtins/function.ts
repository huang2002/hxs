import { SymbolNode } from '3h-ast';
import { ContextValue, FunctionHandler, SyntaxNode, Utils } from '../common';
import { createFunctionHandler } from '../function';

export const builtinFunction = Utils.createDict({

    invoke: Utils.injectHelp(
        'Function.invoke(function, args)',
        createFunctionHandler(2, 2, (args, referer, context) => {
            const fn = args[0];
            if (typeof fn !== 'function') {
                Utils.raise(TypeError, 'expect a function to invoke', referer, context);
            }
            const fnArgs = args[1] as ContextValue[];
            if (!Array.isArray(fnArgs)) {
                Utils.raise(TypeError, 'expect an array as arguments', referer, context);
            }
            const _fnArgs: SyntaxNode[] = [];
            for (let i = 0; i < fnArgs.length; i++) {
                const commaNode: SymbolNode = {
                    type: 'symbol',
                    value: ',',
                    line: referer.line,
                    column: referer.column,
                    offset: referer.offset,
                };
                _fnArgs.push(
                    Utils.createValueNode(fnArgs[i], referer)
                );
                _fnArgs.push(commaNode);
            }
            return (fn as FunctionHandler)(_fnArgs, referer, context);
        })
    ),

});
