import { ContextValue, ScriptContext, SyntaxNode, Utils } from '../common';
import { evalExpression } from "./evalExpression";

/**
 * Evalute a single node.
 */
export const evalNode = (
    node: SyntaxNode,
    context: ScriptContext
): ContextValue => {
    switch (node.type) {
        case 'value': {
            return node.value;
        }
        case 'glob': {
            return node.value.slice(1, -1);
        }
        case 'number': {
            return Utils.parseNumber(node, context);
        }
        case 'span': {
            return evalExpression(node.body, context);
        }
        case 'word': {
            const name = node.value;
            const { store } = context;
            if (!(name in store)) {
                Utils.raise(ReferenceError, `"${name}" is not defined`, node, context);
            }
            return store[name];
        }
        default: {
            Utils.raise(SyntaxError, 'unrecognized syntax', node, context);
            return null; // for type checking (ts v4.3.4)
        }
    }
};
