import { GlobNode, SpanNode, WordNode } from '3h-ast';
import { Common, EvalContextValue } from '../common';
import { evalAST, evalList } from '../eval';
import { createFunction } from './createFunction';
import { numberHandler } from './numberHandler';
import { InternalValue, Rule, RuleHandler, RuleUtils } from './rule';

export const rules: Rule[] = [{
    /**
     * number
     * <number>
     */
    pattern: [RuleUtils.NUMBER],
    handler: numberHandler,
}, {
    /**
     * word
     * <word>
     */
    pattern: [RuleUtils.WORD],
    handler(parts, context, env) {
        const word = (parts[0] as WordNode).value;
        if (!context.has(word)) {
            Common.raise(ReferenceError, `variable "${word}" is not defined`, env);
        }
        return context.get(word);
    },
}, {
    /**
     * glob
     * <glob>
     */
    pattern: [RuleUtils.GLOB],
    handler(parts) {
        return (parts[0] as GlobNode).value.slice(1, -1);
    },
}, {
    /**
     * store
     * <value>$<word>
     */
    pattern: [RuleUtils.VALUE, RuleUtils.DOLLAR, RuleUtils.WORD],
    handler(parts, context) {
        context.set(
            (parts[2] as WordNode).value,
            (parts[0] as InternalValue).value as EvalContextValue
        );
        return (parts[0] as InternalValue).value;
    },
}, {
    /**
     * dot(index)
     * <value>.<word>
     */
    pattern: [RuleUtils.VALUE, RuleUtils.DOT, RuleUtils.WORD],
    handler(parts, context, env) {
        const object = (parts[0] as InternalValue).value;
        if (!Common.isDict(object)) {
            Common.raise(TypeError, `invalid index access`, env);
        }
        const index = (parts[2] as WordNode).value;
        if (!(index in (object as any))) {
            Common.raise(ReferenceError, `unknown index "${index}"`, env);
        }
        return (object as any)[index];
    },
}, {
    /**
     * invoke(normal)
     * <function>(<args...>)
     */
    pattern: [RuleUtils.VALUE, RuleUtils.SPAN_PARATHESIS],
    handler(parts, context, env) {
        const f = (parts[0] as InternalValue).value;
        if (typeof f !== 'function') {
            Common.raise(TypeError, `invalid function call`, env);
        }
        return (f as RuleHandler)(
            (parts[1] as SpanNode).body,
            context,
            env,
        );
    },
}, {
    /**
     * invoke(callback)
     * <function>{...}
     */
    pattern: [RuleUtils.VALUE, RuleUtils.SPAN_BRACKET],
    handler(parts, context, env) {
        const f = (parts[0] as InternalValue).value;
        if (typeof f !== 'function') {
            Common.raise(TypeError, `invalid function call`, env);
        }
        const block = (parts[1] as SpanNode).body;
        const callback: RuleHandler = (_, ctx) => evalAST(block, ctx, env.fileName);
        return (f as RuleHandler)(
            [{
                type: 'value',
                value: callback,
                offset: parts[0].offset,
                line: parts[0].line,
                column: parts[0].column,
            } as InternalValue],
            context,
            env,
        );
    },
}, {
    /**
     * word(string)
     * #<word>
     */
    pattern: [RuleUtils.HASH, RuleUtils.WORD],
    handler(parts, context, env) {
        return (parts[1] as WordNode).value;
    },
}, {
    /**
     * function(named)
     * @<word>(...){...}
     */
    pattern: [RuleUtils.AT, RuleUtils.WORD, RuleUtils.SPAN_PARATHESIS, RuleUtils.SPAN_BRACKET],
    handler(parts, context, env) {
        const f = createFunction(
            (parts[2] as SpanNode).body,
            (parts[3] as SpanNode).body,
            context,
            env.fileName,
        );
        context.set((parts[1] as WordNode).value, f);
        return f;
    },
}, {
    /**
     * function(anonymous)
     * @(...){...}
     */
    pattern: [RuleUtils.AT, RuleUtils.SPAN_PARATHESIS, RuleUtils.SPAN_BRACKET],
    handler(parts, context, env) {
        return createFunction(
            (parts[1] as SpanNode).body,
            (parts[2] as SpanNode).body,
            context,
            env.fileName,
        );
    },
}, {
    /**
     * negative sign
     * -<number>
     */
    pattern: [RuleUtils.MINUS, RuleUtils.NUMBER],
    handler(parts, context, env) {
        return -(numberHandler([parts[1]], context, env) as number);
    },
}, {
    /**
     * negative sign
     * -<word>
     */
    pattern: [RuleUtils.MINUS, RuleUtils.WORD],
    handler(parts, context, env) {
        const word = (parts[1] as WordNode).value;
        if (!context.has(word)) {
            Common.raise(
                ReferenceError,
                `"${word}" is not defined`,
                env
            );
        }
        const value = context.get(word);
        if (typeof value !== 'number') {
            Common.raise(
                TypeError,
                `"${word}" is not a number`,
                env
            );
        }
        return -value!;
    },
}, {
    /**
     * negative sign
     * -(<..., number>)
     */
    pattern: [RuleUtils.MINUS, RuleUtils.SPAN_PARATHESIS],
    handler(parts, context, env) {
        const values = evalList((parts[1] as SpanNode).body, context, env.fileName);
        const number = values[values.length - 1];
        if (typeof number !== 'number') {
            Common.raise(
                TypeError,
                `invalid operator "-"`,
                env
            );
        }
        return -number!;
    },
}, {
    /**
     * positive sign
     * +<number>
     */
    pattern: [RuleUtils.PLUS, RuleUtils.NUMBER],
    handler(parts, context, env) {
        return numberHandler([parts[1]], context, env);
    },
}, {
    /**
     * positive sign
     * +<word>
     */
    pattern: [RuleUtils.PLUS, RuleUtils.WORD],
    handler(parts, context, env) {
        const word = (parts[1] as WordNode).value;
        if (!context.has(word)) {
            Common.raise(
                ReferenceError,
                `"${word}" is not defined`,
                env
            );
        }
        const value = context.get(word);
        if (typeof value !== 'number') {
            Common.raise(
                TypeError,
                `"${word}" is not a number`,
                env
            );
        }
        return value;
    },
}, {
    /**
     * positive sign
     * +(<..., number>)
     */
    pattern: [RuleUtils.PLUS, RuleUtils.SPAN_PARATHESIS],
    handler(parts, context, env) {
        const values = evalList((parts[1] as SpanNode).body, context, env.fileName);
        const number = values[values.length - 1];
        if (typeof number !== 'number') {
            Common.raise(
                TypeError,
                `invalid operator "+"`,
                env
            );
        }
        return number;
    },
}, {
    /**
     * parathesis
     * (...)
     */
    pattern: [RuleUtils.SPAN_PARATHESIS],
    handler(parts, context, env) {
        const body = (parts[0] as SpanNode).body;
        const results = evalList(body, context, env.fileName);
        return results[results.length - 1];
    },
}, {
    /**
     * brace(array)
     * [...]
     */
    pattern: [RuleUtils.SPAN_BRACE],
    handler(parts, context, env) {
        const { body } = parts[0] as SpanNode;
        return body.length ? evalList(body, context, env.fileName) : [];
    },
}, {
    /**
     * brace(index)
     * <value>[...]
     */
    pattern: [RuleUtils.VALUE, RuleUtils.SPAN_BRACE],
    handler(parts, context, env) {
        const object = (parts[0] as InternalValue).value;
        const values = evalList((parts[1] as SpanNode).body, context, env.fileName);
        const index = values[values.length - 1] as number;
        if (Array.isArray(object)) {
            if (typeof index !== 'number' || index !== index) {
                Common.raise(TypeError, `expect a finite number as array index`, env);
            }
            const normalizedIndex = index < 0
                ? object.length + index
                : index;
            if (normalizedIndex >= object.length || normalizedIndex < 0) {
                Common.raise(RangeError, `index(${index}) out of range`, env);
            }
            return object[normalizedIndex];
        } else if (Common.isDict(object)) {
            if (typeof index !== 'string') {
                Common.raise(TypeError, `expect a string as dict index`, env);
            }
            if (!(index in (object as any))) {
                Common.raise(RangeError, `unknown dict index "${index}"`, env);
            }
            return (object as any)[index];
        }
        Common.raise(TypeError, `invalid index access`, env);
    },
}];
