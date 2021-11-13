import { SyntaxHandler } from '../common';
import { inlineExpressionHandler } from '../function/inlineExpression';
import { inlineFunctionHandler } from '../function/inlineFunction';
import { assignmentOperators } from './assignmentOperators';
import { bitOperators } from './bitOperators';
import { booleanOperators } from './booleanOperators';
import { braceHandler } from './braceHandler';
import { bracketHandler } from './bracketHandler';
import { OperatorDefinition } from './common';
import { compareOperators } from './compareOperators';
import { mathOperators } from './mathOperators';
import { miscOperators } from './miscOperators';
import { parathesisHandler } from './parathesisHandler';

export * from './common';

/**
 * List of operator definitions.
 */
export const operators: readonly OperatorDefinition[] = [
    ...mathOperators,
    ...compareOperators,
    ...booleanOperators,
    ...bitOperators,
    ...assignmentOperators,
    ...miscOperators,
    {
        symbol: '@',
        priority: 0,
        ltr: true,
        handler: inlineFunctionHandler,
    },
    {
        symbol: '=>',
        priority: 0,
        ltr: true,
        handler: inlineExpressionHandler,
    },
    {
        symbol: '[',
        priority: 1,
        ltr: true,
        handler: braceHandler,
    },
    {
        symbol: '(',
        priority: 1,
        ltr: true,
        handler: parathesisHandler,
    },
    {
        symbol: '{',
        priority: 1,
        ltr: true,
        handler: bracketHandler,
    },
];

/**
 * A utility map. (operator->handler)
 */
export const operatorHandlers: ReadonlyMap<string, SyntaxHandler> = new Map(
    operators.map(op => [op.symbol, op.handler])
);

/**
 * A utility map. (operator->priority)
 */
export const operatorPriorities: ReadonlyMap<string, number> = new Map(
    operators.map(op => [op.symbol, op.priority])
);

/**
 * A utility map. (operator->ltr)
 */
export const operatorLtr: ReadonlyMap<string, boolean> = new Map(
    operators.map(op => [op.symbol, op.ltr])
);
