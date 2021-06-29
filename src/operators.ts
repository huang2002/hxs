import { SpanNode, SymbolNode, WordNode } from '3h-ast';
import { Dict, FunctionHandler, ContextValue, SyntaxHandler, Utils } from './common';
import { evalBufferNode, evalExpression, evalList, evalNode } from './eval';
import { createInlineFunction } from './function';

export interface OperatorDefinition {
    symbol: string;
    priority: number;
    handler: SyntaxHandler;
}
/** dts2md break */
export const createBinaryOperator = <
    T extends ContextValue,
    U extends ContextValue
>(
    typeA: string,
    typeB: string,
    handler: (a: T, b: U) => ContextValue,
): SyntaxHandler => (
    (buffer, index, context) => {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        if (typeof a !== typeA) {
            Utils.raise(TypeError, `expect a ${typeA}`, buffer[index - 1], context);
        }
        if (typeof b !== typeB) {
            Utils.raise(TypeError, `expect a ${typeB}`, buffer[index + 1], context);
        }
        const valueNode = Utils.createValueNode(
            handler((a as T), (b as U)),
            buffer[index],
        );
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    }
);
/** dts2md break */
/**
 * List of operator definitions.
 */
export const operators: readonly OperatorDefinition[] = [{
    symbol: '@',
    priority: 0,
    handler: createInlineFunction,
}, {
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
}, {
    symbol: '[',
    priority: 1,
    handler(buffer, index, context) {
        if (index === 0 || buffer[index - 1].type === 'symbol') { // array creation
            const value = evalList((buffer[index] as SpanNode).body, context);
            buffer[index] = Utils.createValueNode(value, buffer[index]);
        } else { // index access
            const target = evalBufferNode(buffer, index - 1, buffer[index], context);
            if (!Utils.isDict(target)) {
                Utils.raise(TypeError, 'expect a dict', buffer[index - 1], context);
            }
            const name = evalExpression((buffer[index] as SpanNode).body, context);
            if (typeof name !== 'string') {
                Utils.raise(TypeError, 'expect a string inside', buffer[index], context);
            }
            let value: ContextValue;
            if ((name as string) in (target as Dict)) {
                value = (target as Dict)[name as string];
            } else {
                value = null;
            }
            const valueNode = Utils.createValueNode(value, buffer[index]);
            Utils.replaceBuffer(buffer, index - 1, 2, valueNode);
        }
    },
}, {
    symbol: '(',
    priority: 1,
    handler(buffer, index, context) {
        if (index === 0 || buffer[index - 1].type === 'symbol') { // pure paratheses
            const value = evalExpression((buffer[index] as SpanNode).body, context);
            buffer[index] = Utils.createValueNode(value, buffer[index]);
        } else { // function call
            const handler = evalNode(buffer[index - 1], context);
            if (typeof handler !== 'function') {
                Utils.raise(TypeError, 'expect a function', buffer[index], context);
            }
            const value = (handler as FunctionHandler)(
                (buffer[index] as SpanNode).body,
                buffer[index],
                context,
            );
            const valueNode = Utils.createValueNode(value, buffer[index]);
            Utils.replaceBuffer(buffer, index - 1, 2, valueNode);
        }
    },
}, {
    symbol: '{',
    priority: 1,
    handler(buffer, index, context) {
        if (index === 0 || buffer[index - 1].type === 'symbol') { // dict creation
            const result = Object.create(null) as Dict;
            const nodes = (buffer[index] as SpanNode).body;
            let left = 0;
            for (let right = 0; right < nodes.length; right++) {
                const node = nodes[right];
                if (node.type !== 'symbol' || node.value !== ',') {
                    if (right + 1 === nodes.length) {
                        right++;
                    } else {
                        continue;
                    }
                }
                let j;
                for (j = left; j < right; j++) {
                    if (
                        nodes[j].type === 'symbol'
                        && (nodes[j] as SymbolNode).value === ':'
                    ) {
                        break;
                    }
                }
                if (j === right) {
                    Utils.raise(SyntaxError, 'invalid dict creation', buffer[index], context);
                }
                const name = evalExpression(nodes, context, left, j);
                const value = evalExpression(nodes, context, j + 1, right);
                if (typeof name !== 'string') {
                    Utils.raise(TypeError, 'expect a string', buffer[left], context);
                }
                result[name as string] = value;
                left = right + 1;
            }
            buffer[index] = Utils.createValueNode(result, buffer[index]);
        } else { // callback invocation
            // TODO:
        }

    },
}, {
    symbol: '**',
    priority: 2,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        Math.pow,
    ),
}, {
    symbol: '!',
    priority: 2,
    handler(buffer, index, context) {
        const operand = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(!operand, buffer[index]);
        Utils.replaceBuffer(buffer, index, 2, valueNode);
    },
}, {
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
}, {
    symbol: '*',
    priority: 3,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a * b)
    ),
}, {
    symbol: '/',
    priority: 3,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a / b)
    ),
}, {
    symbol: '+',
    priority: 4,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a + b)
    ),
}, {
    symbol: '-',
    priority: 4,
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
}, {
    symbol: '<',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a < b)
    ),
}, {
    symbol: '>',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a > b)
    ),
}, {
    symbol: '<=',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a <= b)
    ),
}, {
    symbol: '>=',
    priority: 6,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a >= b)
    ),
}, {
    symbol: '==',
    priority: 7,
    handler(buffer, index, context) {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(a === b, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    },
}, {
    symbol: '!=',
    priority: 7,
    handler(buffer, index, context) {
        const a = evalBufferNode(buffer, index - 1, buffer[index], context);
        const b = evalBufferNode(buffer, index + 1, buffer[index], context);
        const valueNode = Utils.createValueNode(a !== b, buffer[index]);
        Utils.replaceBuffer(buffer, index - 1, 3, valueNode);
    },
}, {
    symbol: '&',
    priority: 8,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a & b)
    ),
}, {
    symbol: '^',
    priority: 9,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a ^ b)
    ),
}, {
    symbol: '|',
    priority: 10,
    handler: createBinaryOperator<number, number>(
        'number',
        'number',
        (a, b) => (a | b)
    ),
}, {
    symbol: '&&',
    priority: 11,
    handler: createBinaryOperator<boolean, boolean>(
        'boolean',
        'boolean',
        (a, b) => (a && b)
    ),
}, {
    symbol: '||',
    priority: 12,
    handler: createBinaryOperator<boolean, boolean>(
        'boolean',
        'boolean',
        (a, b) => (a || b)
    ),
}, {
    symbol: '=',
    priority: Infinity,
    handler(buffer, index, context) {
        if (index === 0) {
            Utils.raise(SyntaxError, 'no variable name given', buffer[index], context);
        }
        const nameNode = buffer[index - 1];
        if (nameNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word as variable name', buffer[index], context);
        }
        const value = evalExpression(buffer, context, index + 1);
        context.store.set((nameNode as WordNode).value, value);
        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, index - 1, buffer.length - index + 1, valueNode);
    },
}];
/** dts2md break */
/**
 * A utility map. (operator->handler)
 */
export const operatorHandlers: ReadonlyMap<string, SyntaxHandler> = new Map(
    operators.map(op => [op.symbol, op.handler])
);
/** dts2md break */
/**
 * Another utility map. (operator->priority)
 */
export const operatorPriorities: ReadonlyMap<string, number> = new Map(
    operators.map(op => [op.symbol, op.priority])
);
