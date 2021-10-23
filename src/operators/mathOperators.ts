import { Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { evalBinaryOperation, evalUnaryOperation } from '../index';
import { createBinaryOperator, OperatorDefinition } from './common';

export const mathOperators: OperatorDefinition[] = [{
    symbol: '**',
    priority: 2,
    ltr: false,
    handler: createBinaryOperator<number, number>(
        '__pow',
        'number',
        'number',
        Math.pow,
    ),
}, {
    symbol: '*',
    priority: 3,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__multiply',
        'number',
        'number',
        (a, b) => (a * b)
    ),
}, {
    symbol: '/',
    priority: 3,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__divide',
        'number',
        'number',
        (a, b) => (a / b)
    ),
}, {
    symbol: '%',
    priority: 3,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__mod',
        'number',
        'number',
        (a, b) => (a % b)
    ),
}, {
    symbol: '+',
    priority: 4,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__plus',
        'number',
        'number',
        (a, b) => (a + b)
    ),
}, {
    symbol: '-',
    priority: 4,
    ltr: true,
    handler(buffer, index, context) {
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);

        if (index === 0 || buffer[index - 1].type === 'symbol') { // unary

            const result = evalUnaryOperation<number>(
                b,
                '__opposite',
                'number',
                (x) => (-x),
                buffer,
                index,
                context,
            );

            const valueNode = Utils.createValueNode(result, buffer[index]);
            Utils.replaceBuffer(buffer, index, 2, valueNode);

        } else { // binary

            const a = evalBufferNode(buffer, index - 1, buffer[index], context);

            const result = evalBinaryOperation<number, number>(
                a,
                b,
                '__minus',
                'number',
                'number',
                (a, b) => (a - b),
                buffer,
                index,
                context,
            );

            const valueNode = Utils.createValueNode(result, buffer[index]);
            Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

        }

    },
}];
