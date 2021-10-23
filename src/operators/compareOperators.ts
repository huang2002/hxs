import { Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { createBinaryOperator, OperatorDefinition } from './common';

export const compareOperators: OperatorDefinition[] = [{
    symbol: '<',
    priority: 6,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__lt',
        'number',
        'number',
        (a, b) => (a < b)
    ),
}, {
    symbol: '>',
    priority: 6,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__gt',
        'number',
        'number',
        (a, b) => (a > b)
    ),
}, {
    symbol: '<=',
    priority: 6,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__lte',
        'number',
        'number',
        (a, b) => (a <= b)
    ),
}, {
    symbol: '>=',
    priority: 6,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__gte',
        'number',
        'number',
        (a, b) => (a >= b)
    ),
}, {
    symbol: '==',
    priority: 7,
    ltr: true,
    handler: createBinaryOperator(
        '__equal',
        null,
        null,
        (a, b) => (a === b)
    ),
}, {
    symbol: '!=',
    priority: 7,
    ltr: true,
    handler: createBinaryOperator(
        '__notEqual',
        null,
        null,
        (a, b) => (a !== b)
    ),
}, {
    symbol: '===',
    priority: 7,
    ltr: true,
    handler(buffer, index, context) {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(a === b, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    },
}, {
    symbol: '!==',
    priority: 7,
    ltr: true,
    handler(buffer, index, context) {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(a !== b, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    },
}];
