import { ContextValue, ScriptContext, SyntaxNode, Utils } from '../common';
import { evalExpression } from './evalExpression';

/**
 * Evalute an list.
 */
export const evalList = (
    nodes: readonly SyntaxNode[],
    context: ScriptContext,
    begin = 0,
    end = nodes.length
) => {
    const result: ContextValue[] = [];
    if (begin >= end) {
        return result;
    }
    let left = begin;
    for (let right = 0; right <= end; right++) {
        if (right < end) {
            const node = nodes[right];
            if (node.type !== 'symbol' || node.value !== ',') {
                continue;
            }
        }
        const firstNode = nodes[left];
        if (firstNode.type === 'symbol' && firstNode.value === '...') {
            const values = evalExpression(nodes, context, left + 1, right) as ContextValue[];
            if (!Array.isArray(values)) {
                Utils.raise(TypeError, 'expect an array following', firstNode, context);
            }
            for (let i = 0; i < values.length; i++) {
                result.push(values[i]);
            }
        } else {
            result.push(evalExpression(nodes, context, left, right));
        }
        if (right < end - 1) {
            left = right + 1;
        } else {
            break;
        }
    }
    return result;
};
