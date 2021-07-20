import { ScriptContext, SyntaxNode } from '../common';
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
    const result = [];
    let left = begin;
    for (let right = 0; right < end; right++) {
        const node = nodes[right];
        if (node.type === 'symbol' && node.value === ',') {
            result.push(evalExpression(nodes, context, left, right));
            left = right + 1;
        }
    }
    if (left < end) { // ends without a semicolon
        result.push(evalExpression(nodes, context, left, end));
    }
    return result;
};
