import { ScriptContext, SyntaxNode, Utils } from '../common';
import { evalNode } from './evalNode';

/**
 * Execute and replace the given node of the buffer.
 */
export const evalBufferNode = (
    buffer: SyntaxNode[],
    index: number,
    referrer: SyntaxNode,
    context: ScriptContext
) => {
    if (index < 0 || index >= buffer.length) {
        Utils.raise(SyntaxError, 'invalid operation', referrer, context);
    }
    return evalNode(buffer[index], context);
};
