import { Utils } from '../common';
import { evalBufferNode } from '../eval';
import { createBinaryOperator, OperatorDefinition } from './common';

export const compareOperators: OperatorDefinition[] = [{
    symbol: '<',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a < b)
    ),
}, {
    symbol: '>',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a > b)
    ),
}, {
    symbol: '<=',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a <= b)
    ),
}, {
    symbol: '>=',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a >= b)
    ),
}, {
    symbol: '==',
    priority: 7,
    handler(buffer, index, context) {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(a === b, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    },
}, {
    symbol: '!=',
    priority: 7,
    handler(buffer, index, context) {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(a !== b, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    },
}];
