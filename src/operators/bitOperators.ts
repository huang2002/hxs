import { createUnaryOperator, createBinaryOperator, OperatorDefinition } from './common';

export const bitOperators: OperatorDefinition[] = [{
    symbol: '~',
    priority: 2,
    ltr: false,
    handler: createUnaryOperator<number>(
        '__bitNot',
        'number',
        (x) => (~x)
    ),
}, {
    symbol: '<<',
    priority: 5,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__leftShift',
        'number',
        'number',
        (a, b) => (a << b)
    ),
}, {
    symbol: '>>',
    priority: 5,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__rightShift',
        'number',
        'number',
        (a, b) => (a >> b)
    ),
}, {
    symbol: '>>>',
    priority: 5,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__unsignedRightShift',
        'number',
        'number',
        (a, b) => (a >>> b)
    ),
}, {
    symbol: '&',
    priority: 8,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__bitAnd',
        'number',
        'number',
        (a, b) => (a & b)
    ),
}, {
    symbol: '^',
    priority: 9,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__bitXor',
        'number',
        'number',
        (a, b) => (a ^ b)
    ),
}, {
    symbol: '|',
    priority: 10,
    ltr: true,
    handler: createBinaryOperator<number, number>(
        '__bitOr',
        'number',
        'number',
        (a, b) => (a | b)
    ),
}];
