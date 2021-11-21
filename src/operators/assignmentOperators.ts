import { SymbolNode } from '3h-ast';
import { ContextValue, Utils } from '../common';
import { evalExpression } from "../eval/evalExpression";
import { setProperty } from '../builtins/common';
import { createAdditionalAssignmentOperator, OperatorDefinition } from './common';

export const assignmentOperators: OperatorDefinition[] = [{
    symbol: '=',
    priority: -Infinity,
    ltr: true,
    handler(buffer, index, context) {

        const operationReferrer = buffer[index];

        if (index === 0) {
            Utils.raise(SyntaxError, 'expect a variable preceding', operationReferrer, context);
        }

        const precedingNode = buffer[index - 1];
        const value = evalExpression(buffer, context, index + 1);

        if (precedingNode.type === 'word') { // a = b or a.b = c

            if (index === 1) { // a = b

                context.store[precedingNode.value] = value;

            } else { // a.b = c

                if (
                    index === 2
                    || buffer[index - 2].type !== 'symbol'
                    || (buffer[index - 2] as SymbolNode).value !== '.'
                ) {
                    Utils.raise(SyntaxError, 'invalid assignment', operationReferrer, context);
                }

                const target = evalExpression(buffer, context, 0, index - 2);
                if (!Utils.isDict(target)) {
                    Utils.raise(TypeError, 'expect a dict as assignment target', buffer[0], context);
                }

                setProperty(
                    target,
                    precedingNode.value,
                    value,
                    buffer[0],
                    operationReferrer,
                    context,
                );

            }

        } else if (
            precedingNode.type === 'span'
            && precedingNode.start === '['
        ) { // a[b] = c

            const target = evalExpression(buffer, context, 0, index - 1);
            const key = evalExpression(precedingNode.body, context);
            setProperty(
                target,
                key,
                value,
                buffer[0],
                operationReferrer,
                context,
            );

        } else {
            Utils.raise(SyntaxError, 'invalid assignment', operationReferrer, context);
        }

        const valueNode = Utils.createValueNode(value, operationReferrer);
        Utils.replaceBuffer(buffer, 0, buffer.length, valueNode);

    },
}, {
    symbol: '+=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__plus',
        'number',
        'number',
        (a, b) => (a + b)
    ),
}, {
    symbol: '-=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__minus',
        'number',
        'number',
        (a, b) => (a - b)
    ),
}, {
    symbol: '*=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__multiply',
        'number',
        'number',
        (a, b) => (a * b)
    ),
}, {
    symbol: '/=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__divide',
        'number',
        'number',
        (a, b) => (a / b)
    ),
}, {
    symbol: '%=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__mod',
        'number',
        'number',
        (a, b) => (a % b)
    ),
}, {
    symbol: '**=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__pow',
        'number',
        'number',
        (a, b) => (a ** b)
    ),
}, {
    symbol: '&=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__bitAnd',
        'number',
        'number',
        (a, b) => (a & b)
    ),
}, {
    symbol: '^=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__bitXor',
        'number',
        'number',
        (a, b) => (a ^ b)
    ),
}, {
    symbol: '|=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__bitOr',
        'number',
        'number',
        (a, b) => (a | b)
    ),
}, {
    symbol: '<<=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__leftShift',
        'number',
        'number',
        (a, b) => (a << b)
    ),
}, {
    symbol: '>>=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__rightShift',
        'number',
        'number',
        (a, b) => (a >> b)
    ),
}, {
    symbol: '>>>=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<number, number>(
        '__unsignedRightShift',
        'number',
        'number',
        (a, b) => (a >>> b)
    ),
}, {
    symbol: '&&=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<boolean, boolean>(
        '__and',
        'boolean',
        'boolean',
        (a, b) => (a && b)
    ),
}, {
    symbol: '||=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<boolean, boolean>(
        '__or',
        'boolean',
        'boolean',
        (a, b) => (a || b)
    ),
}, {
    symbol: '??=',
    priority: -Infinity,
    ltr: true,
    handler: createAdditionalAssignmentOperator<ContextValue, ContextValue>(
        '__nullOr',
        null,
        null,
        (a, b) => (a ?? b)
    ),
}];
