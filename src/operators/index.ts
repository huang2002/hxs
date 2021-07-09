import { WordNode } from '3h-ast';
import { Dict, ContextValue, SyntaxHandler, Utils } from '../common';
import { evalBufferNode } from '../eval';
import { createInlineFunction } from '../function';
import { assignmentOperators } from './assignmentOperators';
import { bitOperators } from './bitOperators';
import { booleanOperators } from './booleanOperators';
import { braceHandler } from './braceHandler';
import { bracketHandler } from './bracketHandler';
import { OperatorDefinition } from './common';
import { compareOperators } from './compareOperators';
import { mathOperators } from './mathOperators';
import { parathesisHandler } from './parathesisHandler';

/**
 * List of operator definitions.
 */
export const operators: readonly OperatorDefinition[] = [
    ...mathOperators,
    ...compareOperators,
    ...booleanOperators,
    ...bitOperators,
    ...assignmentOperators,
    {
        symbol: '@',
        priority: 0,
        handler: createInlineFunction,
    },
    {
        symbol: '.',
        priority: 1,
        handler(buffer, index, context) {

            const target = evalBufferNode(buffer, index - 1, buffer[index], context);
            if (!Utils.isDict(target)) {
                Utils.raise(TypeError, 'expect a dict', buffer[index - 1], context);
            }

            const nameNode = buffer[index + 1];
            if (!nameNode || nameNode.type !== 'word') {
                Utils.raise(TypeError, 'expect a word following', buffer[index], context);
            }

            const name = (nameNode as WordNode).value;
            let value: ContextValue;
            if (name in (target as Dict)) {
                value = (target as Dict)[name];
            } else {
                value = null;
            }

            const valueNode = Utils.createValueNode(value, buffer[index]);
            Utils.replaceBuffer(buffer, index - 1, 3, valueNode);

        },
    },
    {
        symbol: '[',
        priority: 1,
        handler: braceHandler,
    },
    {
        symbol: '(',
        priority: 1,
        handler: parathesisHandler,
    },
    {
        symbol: '{',
        priority: 1,
        handler: bracketHandler,
    },
    {
        symbol: '#',
        priority: 2,
        handler(buffer, index, context) {
            const wordNode = buffer[index + 1];
            if (index + 1 === buffer.length || wordNode.type !== 'word') {
                Utils.raise(SyntaxError, 'expect a word following', buffer[index], context);
            }
            const valueNode = Utils.createValueNode((wordNode as WordNode).value, buffer[index]);
            Utils.replaceBuffer(buffer, index, 2, valueNode);
        },
    }
];

/**
 * A utility map. (operator->handler)
 */
export const operatorHandlers: ReadonlyMap<string, SyntaxHandler> = new Map(
    operators.map(op => [op.symbol, op.handler])
);

/**
 * Another utility map. (operator->priority)
 */
export const operatorPriorities: ReadonlyMap<string, number> = new Map(
    operators.map(op => [op.symbol, op.priority])
);
