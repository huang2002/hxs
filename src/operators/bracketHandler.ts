import { SpanNode, SymbolNode } from '3h-ast';
import { Dict, FunctionHandler, SyntaxHandler, Utils } from '../common';
import { compileNodes, evalCompiledNodes } from "../eval/evalNodes";
import { evalExpression } from "../eval/evalExpression";
import { evalNode } from "../eval/evalNode";

export const bracketHandler: SyntaxHandler = (buffer, index, context) => {

    if (index === 0 || buffer[index - 1].type === 'symbol') { // dict creation

        const result = Object.create(null) as Dict;
        const nodes = (buffer[index] as SpanNode).body;

        if (nodes.length === 0) {
            buffer[index] = Utils.createValueNode(result, buffer[index]);
            return;
        }

        let left = 0;
        for (let right = 0; right <= nodes.length; right++) {

            if (right < nodes.length) {
                const node = nodes[right];
                if (node.type !== 'symbol' || node.value !== ',') {
                    continue;
                }
            }

            let j;
            for (j = left; j < right; j++) {
                if (nodes[j].type === 'symbol'
                    && (nodes[j] as SymbolNode).value === '->') {
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

            if (right < nodes.length - 1) {
                left = right + 1;
            } else {
                break;
            }

        }

        buffer[index] = Utils.createValueNode(result, buffer[index]);

    } else { // callback invocation

        const handler = evalNode(buffer[index - 1], context);
        if (typeof handler !== 'function') {
            Utils.raise(TypeError, 'expect a function', buffer[index], context);
        }

        const compiledBody = compileNodes((buffer[index] as SpanNode).body, context);
        const callback: FunctionHandler = (args, referrer, _context) => {
            return evalCompiledNodes(compiledBody, _context, true);
        };

        const returnValue = (handler as FunctionHandler)(
            [Utils.createValueNode(callback, buffer[index])],
            buffer[index],
            context,
            null,
        );

        const valueNode = Utils.createValueNode(returnValue, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
