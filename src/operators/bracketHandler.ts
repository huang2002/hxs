import { SpanNode, SymbolNode } from '3h-ast';
import { Dict, FunctionHandler, SyntaxHandler, Utils } from '../common';
import { evalExpression, evalNode, evalNodes } from '../eval';

export const bracketHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // dict creation

        const result = Object.create(null) as Dict;
        const nodes = (buffer[index] as SpanNode).body;

        let left = 0;
        for (let right = 0; right < nodes.length; right++) {

            const node = nodes[right];
            if (node.type !== 'symbol' || node.value !== ',') {
                if (right + 1 === nodes.length) {
                    right++;
                } else {
                    continue;
                }
            }

            let j;
            for (j = left; j < right; j++) {
                if (nodes[j].type === 'symbol'
                    && (nodes[j] as SymbolNode).value === ':') {
                    break;
                }
            }

            if (j === right) {
                Utils.raise(SyntaxError, 'invalid dict creation', buffer[index], context);
            }

            const name = evalExpression(nodes, context, left, j);
            if (typeof name !== 'string') {
                Utils.raise(TypeError, 'expect a string', buffer[left], context);
            }

            const value = evalExpression(nodes, context, j + 1, right);
            result[name as string] = value;

            left = right + 1;

        }

        buffer[index] = Utils.createValueNode(result, buffer[index]);

    } else { // callback invocation

        const handler = evalNode(buffer[index - 1], context);
        if (typeof handler !== 'function') {
            Utils.raise(TypeError, 'expect a function', buffer[index], context);
        }

        const callback: FunctionHandler = (args, referer, _context) => {
            return evalNodes((buffer[index] as SpanNode).body, _context);
        };

        const returnValue = (handler as FunctionHandler)(
            [Utils.createValueNode(callback, buffer[index])],
            buffer[index],
            context
        );

        const valueNode = Utils.createValueNode(returnValue, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
