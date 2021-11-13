import { SpanNode, SymbolNode, WordNode } from '3h-ast';
import { Dict, FunctionHandler, SyntaxHandler, Utils } from '../common';
import { compileNodes, evalCompiledNodes } from "../eval/evalNodes";
import { evalExpression } from "../eval/evalExpression";
import { evalNode } from "../eval/evalNode";
import { invoke, isInvocable } from '../function/common';
import { createInlineFunction } from '../index';

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

            const firstNode = nodes[left];
            if (firstNode.type === 'symbol' && firstNode.value === '...') { // expand

                const props = evalExpression(nodes, context, left + 1, right);
                if (!Utils.isDict(props)) {
                    Utils.raise(TypeError, 'expect a dict to expand', firstNode, context);
                }

                Object.assign(result, props);

            } else { // insert

                let j;
                for (j = left; j < right; j++) {
                    if (nodes[j].type === 'symbol'
                        && (nodes[j] as SymbolNode).value === '->') {
                        break;
                    }
                }

                if (j === right) { // shortcut

                    if (firstNode.type === 'symbol' && firstNode.value === '@') { // function

                        if (right < left + 3) {
                            Utils.raise(SyntaxError, 'invalid function declaration', firstNode, context);
                        }

                        const nameNode = nodes[left + 1];
                        if (nameNode.type !== 'word') {
                            Utils.raise(SyntaxError, 'invalid function declaration', firstNode, context);
                        }

                        const name = (nameNode as WordNode).value;
                        const func = createInlineFunction(nodes, left + 1, context);
                        result[name] = func;

                    } else { // variable

                        const name = evalExpression(nodes, context, left, right) as string;
                        if (typeof name !== 'string') {
                            Utils.raise(TypeError, 'expect a string as key', firstNode, context);
                        }
                        if (!(name in context.store)) {
                            Utils.raise(ReferenceError, `${Utils.toDisplay(name)} is not defined`, firstNode, context);
                        }

                        result[name] = context.store[name];

                    }

                } else { // key -> value

                    const name = evalExpression(nodes, context, left, j) as string;
                    if (typeof name !== 'string') {
                        Utils.raise(TypeError, 'expect a string as key', firstNode, context);
                    }

                    const value = evalExpression(nodes, context, j + 1, right);
                    result[name] = value;

                }

            }

            if (right < nodes.length - 1) {
                left = right + 1;
            } else {
                break;
            }

        }

        buffer[index] = Utils.createValueNode(result, buffer[index]);

    } else { // callback invocation

        const handler = evalNode(buffer[index - 1], context);
        if (!isInvocable(handler)) {
            Utils.raise(TypeError, 'expect an invocable', buffer[index], context);
        }

        const compiledBody = compileNodes((buffer[index] as SpanNode).body, context);
        const callback: FunctionHandler = (args, referrer, _context) => {
            return evalCompiledNodes(compiledBody, _context, true, true);
        };

        const returnValue = invoke(
            handler,
            [Utils.createValueNode(callback, buffer[index])],
            buffer[index],
            context,
            null,
        );

        const valueNode = Utils.createValueNode(returnValue, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 2, valueNode);

    }

};
