import { WordNode } from '3h-ast';
import { ContextValue, Utils } from '../common';
import { evalExpression } from "../eval/evalExpression";
import { createAdditionalAssignmentOperator, OperatorDefinition } from './common';

export const assignmentOperators: OperatorDefinition[] = [{
    symbol: '=',
    priority: Infinity,
    ltr: false,
    handler(buffer, index, context) {

        if (index === 0) {
            Utils.raise(SyntaxError, 'expect a variable name preceding', buffer[index], context);
        }

        const nameNode = buffer[index - 1] as WordNode;
        if (nameNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word as variable name', buffer[index - 1], context);
        }

        const value = evalExpression(buffer, context, index + 1);
        context.store[nameNode.value] = value;

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '+=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__plus',
        'number',
        'number',
        (a, b) => (a + b)
    ),
}, {
    symbol: '-=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__minus',
        'number',
        'number',
        (a, b) => (a - b)
    ),
}, {
    symbol: '*=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__multiply',
        'number',
        'number',
        (a, b) => (a * b)
    ),
}, {
    symbol: '/=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__divide',
        'number',
        'number',
        (a, b) => (a / b)
    ),
}, {
    symbol: '%=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__mod',
        'number',
        'number',
        (a, b) => (a % b)
    ),
}, {
    symbol: '**=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__pow',
        'number',
        'number',
        (a, b) => (a ** b)
    ),
}, {
    symbol: '&=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__bitAnd',
        'number',
        'number',
        (a, b) => (a & b)
    ),
}, {
    symbol: '^=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__bitXor',
        'number',
        'number',
        (a, b) => (a ^ b)
    ),
}, {
    symbol: '|=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__bitOr',
        'number',
        'number',
        (a, b) => (a | b)
    ),
}, {
    symbol: '<<=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__leftShift',
        'number',
        'number',
        (a, b) => (a << b)
    ),
}, {
    symbol: '>>=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__rightShift',
        'number',
        'number',
        (a, b) => (a >> b)
    ),
}, {
    symbol: '>>>=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__unsignedRightShift',
        'number',
        'number',
        (a, b) => (a >>> b)
    ),
}, {
    symbol: '&&=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<boolean, boolean>(
        '__and',
        'boolean',
        'boolean',
        (a, b) => (a && b)
    ),
}, {
    symbol: '||=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<boolean, boolean>(
        '__or',
        'boolean',
        'boolean',
        (a, b) => (a || b)
    ),
}, {
    symbol: '??=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<ContextValue, ContextValue>(
        '__nullOr',
        null,
        null,
        (a, b) => (a ?? b)
    ),
}];
