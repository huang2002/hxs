import { ContextValue, ScriptContext, SyntaxNode } from '../common';
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
        result.push(evalExpression(nodes, context, left, right));
        if (right < end - 1) {
            left = right + 1;
        } else {
            break;
        }
    }
    return result;
};
