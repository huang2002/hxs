import { Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { createBinaryOperator, OperatorDefinition } from './common';

export const bitOperators: OperatorDefinition[] = [{
    symbol: '~',
    priority: 2,
    ltr: false,
    handler(buffer, index, context) {
        const operand = evalBufferNode(buffer, index + 1, buffer[index], context);
        if (typeof operand !== 'number') {
            Utils.raise(TypeError, 'expect a number', buffer[index + 1], context);
        }
        const valueNode = Utils.createValueNode(~(operand as number), buffer[index]);
        Utils.replaceBuffer(buffer, index, 2, valueNode);
    },
}, {
    symbol: '<<',
    priority: 5,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a << b)
    ),
}, {
    symbol: '>>',
    priority: 5,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a >> b)
    ),
}, {
    symbol: '>>>',
    priority: 5,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a >>> b)
    ),
}, {
    symbol: '&',
    priority: 8,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a & b)
    ),
}, {
    symbol: '^',
    priority: 9,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a ^ b)
    ),
}, {
    symbol: '|',
    priority: 10,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a | b)
    ),
}];
