import { Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { createBinaryOperator, OperatorDefinition } from './common';

export const booleanOperators: OperatorDefinition[] = [{
    symbol: '!',
    priority: 2,
    ltr: false,
    handler(buffer, index, context) {
        const operand = evalBufferNode(buffer, index + 1, buffer[index], context);
        if (typeof operand !== 'boolean') {
            Utils.raise(TypeError, 'expect a boolean following', buffer[index + 1], context);
        }
        const valueNode = Utils.createValueNode(!operand, buffer[index]);
        Utils.replaceBuffer(buffer, index, 2, valueNode);
    },
}, {
    symbol: '&&',
    priority: 11,
    ltr: true,
    handler: createBinaryOperator<boolean, boolean>(
        'boolean',
        'boolean',
        (a, b) => (a && b)
    ),
}, {
    symbol: '||',
    priority: 12,
    ltr: true,
    handler: createBinaryOperator<boolean, boolean>(
        'boolean',
        'boolean',
        (a, b) => (a || b)
    ),
}];
