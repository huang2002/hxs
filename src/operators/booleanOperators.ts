import { createUnaryOperator, createBinaryOperator, OperatorDefinition } from './common';

export const booleanOperators: OperatorDefinition[] = [{
    symbol: '!',
    priority: 2,
    ltr: false,
    handler: createUnaryOperator<boolean>(
        '__not',
        'boolean',
        (x) => (!x)
    ),
}, {
    symbol: '&&',
    priority: 11,
    ltr: true,
    handler: createBinaryOperator<boolean, boolean>(
        '__and',
        'boolean',
        'boolean',
        (a, b) => (a && b)
    ),
}, {
    symbol: '||',
    priority: 12,
    ltr: true,
    handler: createBinaryOperator<boolean, boolean>(
        '__or',
        'boolean',
        'boolean',
        (a, b) => (a || b)
    ),
}];
