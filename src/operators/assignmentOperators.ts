import { WordNode } from '3h-ast';
import { Utils } from '../common';
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

        const nameNode = buffer[index - 1];
        if (nameNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word as variable name', buffer[index - 1], context);
        }

        const value = evalExpression(buffer, context, index + 1);
        context.store.set((nameNode as WordNode).value, value);

        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);

    },
}, {
    symbol: '+=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a + b)
    ),
}, {
    symbol: '-=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a - b)
    ),
}, {
    symbol: '*=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a * b)
    ),
}, {
    symbol: '/=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a / b)
    ),
}, {
    symbol: '&=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a & b)
    ),
}, {
    symbol: '^=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a ^ b)
    ),
}, {
    symbol: '|=',
    priority: Infinity,
    ltr: false,
    handler: createAdditionalAssignmentOperator<number, number>(
        'number',
        'number',
        (a, b) => (a | b)
    ),
}];
