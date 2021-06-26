import { SpanNode, SymbolNode, WordNode } from '3h-ast';
import { Dict, FunctionHandler, ScriptContextValue, SyntaxHandler, Utils } from './common';
import { evalBufferNode, evalExpression, evalList, evalNode } from './eval';
import { createInlineFunction } from './function';

export interface OperatorDefinition {
    symbol: string;
    priority: number;
    handler: SyntaxHandler;
}
/** dts2md break */
export const createBinaryOperator = <
    T extends ScriptContextValue,
    U extends ScriptContextValue
>(
    typeA: string,
    typeB: string,
    handler: (a: T, b: U) => ScriptContextValue,
): SyntaxHandler => (
    (buffer, i, ctx, src) => {
        const a = evalBufferNode(buffer, i - 1, buffer[i], ctx, src);
        const b = evalBufferNode(buffer, i + 1, buffer[i], ctx, src);
        if (typeof a !== typeA) {
            Utils.raise(TypeError, `expect a ${typeA}`, buffer[i - 1], src);
        }
        if (typeof b !== typeB) {
            Utils.raise(TypeError, `expect a ${typeB}`, buffer[i + 1], src);
        }
        const valueNode = Utils.createValueNode(
            handler((a as T), (b as U)),
            buffer[i],
        );
        Utils.replaceBuffer(buffer, i - 1, 3, valueNode);
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
    handler(buffer, i, ctx, src) {
        const target = evalBufferNode(buffer, i - 1, buffer[i], ctx, src);
        if (!Utils.isDict(target)) {
            Utils.raise(TypeError, 'expect a dict', buffer[i - 1], src);
        }
        const nameNode = buffer[i + 1];
        if (!nameNode || nameNode.type !== 'word') {
            Utils.raise(TypeError, 'expect a word following', buffer[i], src);
        }
        const name = (nameNode as WordNode).value;
        let value: ScriptContextValue;
        if (name in (target as Dict)) {
            value = (target as Dict)[name];
        } else {
            value = null;
        }
        const valueNode = Utils.createValueNode(value, buffer[i]);
        Utils.replaceBuffer(buffer, i - 1, 3, valueNode);
    },
}, {
    symbol: '[',
    priority: 1,
    handler(buffer, i, ctx, src) {
        if (i === 0 || buffer[i - 1].type === 'symbol') { // array creation
            const value = evalList((buffer[i] as SpanNode).body, ctx, src);
            buffer[i] = Utils.createValueNode(value, buffer[i]);
        } else { // index access
            const target = evalBufferNode(buffer, i - 1, buffer[i], ctx, src);
            if (!Utils.isDict(target)) {
                Utils.raise(TypeError, 'expect a dict', buffer[i - 1], src);
            }
            const name = evalExpression((buffer[i] as SpanNode).body, ctx, src);
            if (typeof name !== 'string') {
                Utils.raise(TypeError, 'expect a string inside', buffer[i], src);
            }
            let value: ScriptContextValue;
            if ((name as string) in (target as Dict)) {
                value = (target as Dict)[name as string];
            } else {
                value = null;
            }
            const valueNode = Utils.createValueNode(value, buffer[i]);
            Utils.replaceBuffer(buffer, i - 1, 2, valueNode);
        }
    },
}, {
    symbol: '(',
    priority: 1,
    handler(buffer, i, ctx, src) {
        if (i === 0 || buffer[i - 1].type === 'symbol') { // pure paratheses
            const value = evalExpression((buffer[i] as SpanNode).body, ctx, src);
            buffer[i] = Utils.createValueNode(value, buffer[i]);
        } else { // function call
            const handler = evalNode(buffer[i - 1], ctx, src);
            if (typeof handler !== 'function') {
                Utils.raise(TypeError, 'expect a function', buffer[i], src);
            }
            const value = (handler as FunctionHandler)(
                (buffer[i] as SpanNode).body,
                buffer[i],
                ctx,
                src,
            );
            const valueNode = Utils.createValueNode(value, buffer[i]);
            Utils.replaceBuffer(buffer, i - 1, 2, valueNode);
        }
    },
}, {
    symbol: '{',
    priority: 1,
    handler(buffer, i, ctx, src) {
        if (i === 0 || buffer[i - 1].type === 'symbol') { // dict creation
            const result = Object.create(null) as Dict;
            const nodes = (buffer[i] as SpanNode).body;
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
                    Utils.raise(SyntaxError, 'invalid dict creation', buffer[i], src);
                }
                const name = evalExpression(nodes, ctx, src, left, j);
                const value = evalExpression(nodes, ctx, src, j + 1, right);
                if (typeof name !== 'string') {
                    Utils.raise(TypeError, 'expect a string', buffer[left], src);
                }
                result[name as string] = value;
                left = right + 1;
            }
            buffer[i] = Utils.createValueNode(result, buffer[i]);
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
    handler(buffer, i, ctx, src) {
        const operand = evalBufferNode(buffer, i + 1, buffer[i], ctx, src);
        const valueNode = Utils.createValueNode(!operand, buffer[i]);
        Utils.replaceBuffer(buffer, i, 2, valueNode);
    },
}, {
    symbol: '#',
    priority: 2,
    handler(buffer, i, ctx, src) {
        const wordNode = buffer[i + 1];
        if (i + 1 === buffer.length || wordNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word following', buffer[i], src);
        }
        const valueNode = Utils.createValueNode((wordNode as WordNode).value, buffer[i]);
        Utils.replaceBuffer(buffer, i, 2, valueNode);
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
    handler(buffer, i, ctx, src) {
        const b = evalBufferNode(buffer, i + 1, buffer[i], ctx, src);
        if (typeof b !== 'number') {
            Utils.raise(TypeError, 'expect a number', buffer[i - 1], src);
        }
        if (i === 0 || buffer[i - 1].type === 'symbol') { // unary
            const valueNode = Utils.createValueNode(
                -(b as number),
                buffer[i],
            );
            Utils.replaceBuffer(buffer, i, 2, valueNode);
        } else { // binary
            const a = evalBufferNode(buffer, i - 1, buffer[i], ctx, src);
            if (typeof a !== 'number') {
                Utils.raise(TypeError, 'expect a number', buffer[i + 1], src);
            }
            const valueNode = Utils.createValueNode(
                (a as number) - (b as number),
                buffer[i],
            );
            Utils.replaceBuffer(buffer, i - 1, 3, valueNode);
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
    handler(buffer, i, ctx, src) {
        const a = evalBufferNode(buffer, i - 1, buffer[i], ctx, src);
        const b = evalBufferNode(buffer, i + 1, buffer[i], ctx, src);
        const valueNode = Utils.createValueNode(a === b, buffer[i]);
        Utils.replaceBuffer(buffer, i - 1, 3, valueNode);
    },
}, {
    symbol: '!=',
    priority: 7,
    handler(buffer, i, ctx, src) {
        const a = evalBufferNode(buffer, i - 1, buffer[i], ctx, src);
        const b = evalBufferNode(buffer, i + 1, buffer[i], ctx, src);
        const valueNode = Utils.createValueNode(a !== b, buffer[i]);
        Utils.replaceBuffer(buffer, i - 1, 3, valueNode);
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
    handler(buffer, i, ctx, src) {
        if (i === 0) {
            Utils.raise(SyntaxError, 'no variable name given', buffer[i], src);
        }
        const nameNode = buffer[i - 1];
        if (nameNode.type !== 'word') {
            Utils.raise(SyntaxError, 'expect a word as variable name', buffer[i], src);
        }
        const value = evalExpression(buffer, ctx, src, i + 1);
        ctx.set((nameNode as WordNode).value, value);
        const valueNode = Utils.createValueNode(value, nameNode);
        Utils.replaceBuffer(buffer, i - 1, buffer.length - i + 1, valueNode);
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
