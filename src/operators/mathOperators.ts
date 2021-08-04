import { Utils } from '../common';
import { evalBufferNode } from "../eval/evalBufferNode";
import { createBinaryOperator, OperatorDefinition } from './common';

export const mathOperators: OperatorDefinition[] = [{
    symbol: '**',
    priority: 2,
    ltr: false,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        Math.pow,
    ),
}, {
    symbol: '*',
    priority: 3,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a * b)
    ),
}, {
    symbol: '/',
    priority: 3,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a / b)
    ),
}, {
    symbol: '%',
    priority: 3,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a % b)
    ),
}, {
    symbol: '+',
    priority: 4,
    ltr: true,
    handler: createBinaryOperator<number, number>(
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
        if (typeof b !== 'number') {
            Utils.raise(TypeError, 'expect a number', buffer[index - 1], context);
        }

        if (index === 0 || buffer[index - 1].type === 'symbol') { // unary

            const valueNode = Utils.createValueNode(
                -(b as number),
                buffer[index],
            );
            Utils.replaceBuffer(buffer, index, 2, valueNode);

        } else { // binary

            const a = evalBufferNode(buffer, index - 1, buffer[index], context);
            if (typeof a !== 'number') {
                Utils.raise(TypeError, 'expect a number', buffer[index + 1], context);
            }

            const valueNode = Utils.createValueNode(
                (a as number) - (b as number),
                buffer[index],
            );

            Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

        }

    },
}];
