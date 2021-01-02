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
    handler(parts, context, fileName, line) {
        const word = (parts[0] as WordNode).value;
        if (!context.has(word)) {
            throw new ReferenceError(
                `variable "${word}" is not defined (file ${fileName} line ${parts[0].line})`
            );
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
    handler(parts, context, fileName) {
        const object = (parts[0] as InternalValue).value;
        if (!Common.isDict(object)) {
            throw new TypeError(
                `invalid index access (file ${fileName} line ${parts[0].line})`
            );
        }
        const index = (parts[2] as WordNode).value;
        if (!(index in (object as any))) {
            throw new ReferenceError(
                `unknown index "${index}" (file ${fileName} line ${parts[2].line})`
            );
        }
        return (object as any)[index];
    },
}, {
    /**
     * invoke(normal)
     * <function>(<args...>)
     */
    pattern: [RuleUtils.VALUE, RuleUtils.SPAN_PARATHESIS],
    handler(parts, context, fileName, line) {
        const f = (parts[0] as InternalValue).value;
        if (typeof f !== 'function') {
            throw new TypeError(
                `invalid function call (file ${fileName} line ${parts[0].line})`
            );
        }
        return (f as RuleHandler)(
            (parts[1] as SpanNode).body,
            context,
            fileName,
            line,
        );
    },
}, {
    /**
     * invoke(callback)
     * <function>{...}
     */
    pattern: [RuleUtils.VALUE, RuleUtils.SPAN_BRACKET],
    handler(parts, context, fileName, line) {
        const f = (parts[0] as InternalValue).value;
        if (typeof f !== 'function') {
            throw new TypeError(
                `invalid function call (file ${fileName} line ${parts[0].line})`
            );
        }
        const block = (parts[1] as SpanNode).body;
        const callback: RuleHandler = (_, ctx) => evalAST(block, ctx, fileName);
        return (f as RuleHandler)(
            [{
                type: 'value',
                value: callback,
                offset: parts[0].offset,
                line: parts[0].line,
            } as InternalValue],
            context,
            fileName,
            line,
        );
    },
}, {
    /**
     * word(string)
     * #<word>
     */
    pattern: [RuleUtils.HASH, RuleUtils.WORD],
    handler(parts, context, fileName, line) {
        return (parts[1] as WordNode).value;
    },
}, {
    /**
     * function(named)
     * @<word>(...){...}
     */
    pattern: [RuleUtils.AT, RuleUtils.WORD, RuleUtils.SPAN_PARATHESIS, RuleUtils.SPAN_BRACKET],
    handler(parts, context, fileName, line) {
        const f = createFunction(
            (parts[2] as SpanNode).body,
            (parts[3] as SpanNode).body,
            context,
            fileName,
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
    handler(parts, context, fileName, line) {
        return createFunction(
            (parts[1] as SpanNode).body,
            (parts[2] as SpanNode).body,
            context,
            fileName,
        );
    },
}, {
    /**
     * negative sign
     * -<number>
     */
    pattern: [RuleUtils.MINUS, RuleUtils.NUMBER],
    handler(parts, context, fileName, line) {
        return -(numberHandler([parts[1]], context, fileName, line) as number);
    },
}, {
    /**
     * negative sign
     * -<word>
     */
    pattern: [RuleUtils.MINUS, RuleUtils.WORD],
    handler(parts, context, fileName) {
        const word = (parts[1] as WordNode).value;
        if (!context.has(word)) {
            throw new ReferenceError(
                `"${word}" is not defined (file ${fileName} line ${parts[1].line})`
            );
        }
        const value = context.get(word);
        if (typeof value !== 'number') {
            throw new TypeError(
                `"${word}" is not a number (file ${fileName} line ${parts[1].line})`
            );
        }
        return -value;
    },
}, {
    /**
     * negative sign
     * -(<..., number>)
     */
    pattern: [RuleUtils.MINUS, RuleUtils.SPAN_PARATHESIS],
    handler(parts, context, fileName) {
        const values = evalList((parts[1] as SpanNode).body, context, fileName);
        const number = values[values.length - 1];
        if (typeof number !== 'number') {
            throw new TypeError(
                `invalid operator "-" (file ${fileName} line ${parts[0].line})`
            );
        }
        return -number;
    },
}, {
    /**
     * positive sign
     * +<number>
     */
    pattern: [RuleUtils.PLUS, RuleUtils.NUMBER],
    handler(parts, context, fileName, line) {
        return numberHandler([parts[1]], context, fileName, line);
    },
}, {
    /**
     * positive sign
     * +<word>
     */
    pattern: [RuleUtils.PLUS, RuleUtils.WORD],
    handler(parts, context, fileName) {
        const word = (parts[1] as WordNode).value;
        if (!context.has(word)) {
            throw new ReferenceError(
                `"${word}" is not defined (file ${fileName} line ${parts[1].line})`
            );
        }
        const value = context.get(word);
        if (typeof value !== 'number') {
            throw new TypeError(
                `"${word}" is not a number (file ${fileName} line ${parts[1].line})`
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
    handler(parts, context, fileName) {
        const values = evalList((parts[1] as SpanNode).body, context, fileName);
        const number = values[values.length - 1];
        if (typeof number !== 'number') {
            throw new TypeError(
                `invalid operator "+" (file ${fileName} line ${parts[0].line})`
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
    handler(parts, context, fileName) {
        const body = (parts[0] as SpanNode).body;
        const results = evalList(body, context, fileName);
        return results[results.length - 1];
    },
}, {
    /**
     * brace(array)
     * [...]
     */
    pattern: [RuleUtils.SPAN_BRACE],
    handler(parts, context, fileName) {
        const { body } = parts[0] as SpanNode;
        return body.length ? evalList(body, context, fileName) : [];
    },
}, {
    /**
     * brace(index)
     * <value>[...]
     */
    pattern: [RuleUtils.VALUE, RuleUtils.SPAN_BRACE],
    handler(parts, context, fileName) {
        const object = (parts[0] as InternalValue).value;
        const values = evalList((parts[1] as SpanNode).body, context, fileName);
        const index = values[values.length - 1];
        if (Array.isArray(object)) {
            if (typeof index !== 'number' || index !== index) {
                throw new TypeError(
                    `expect a finite number as array index (file ${fileName} line ${parts[1].line})`
                );
            }
            const normalizedIndex = index < 0
                ? object.length + index
                : index;
            if (normalizedIndex >= object.length || normalizedIndex < 0) {
                throw new RangeError(
                    `index(${index}) out of range (file ${fileName} line ${parts[1].line})`
                );
            }
            return object[normalizedIndex];
        } else if (Common.isDict(object)) {
            if (typeof index !== 'string') {
                throw new TypeError(
                    `expect a string as dict index (file ${fileName} line ${parts[1].line})`
                );
            }
            if (!(index in (object as any))) {
                throw new RangeError(
                    `unknown dict index "${index}" (file ${fileName} line ${parts[1].line})`
                );
            }
            return (object as any)[index];
        }
        throw new TypeError(
            `invalid index access (file ${fileName} line ${parts[1].line})`
        );
    },
}];
