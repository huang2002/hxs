import { Common, EvalContext, EvalContextValue } from '../common';
import { evalList } from '../eval';
import { RuleHandler } from '../rules/rule';
import { BuiltinArray } from './array';
import { BuiltinDict } from './dict';
import { builtinIf } from './if';
import { builtinImport } from './import';
import { builtinFor, builtinWhile } from './loop';
import { BuiltinString } from './string';

export const builtins: EvalContext = new Map<string, EvalContextValue>([

    ['true', true],
    ['false', false],
    ['infinity', Infinity],
    ['null', null],
    ['NaN', NaN],

    ['String', BuiltinString],
    ['Dict', BuiltinDict],
    ['Array', BuiltinArray],

    ['import', builtinImport],
    ['if', builtinIf],
    ['for', builtinFor],
    ['while', builtinWhile],

    ['help', Common.injectHelp(
        'help(target)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'help', 1, 1);
            if (
                typeof args[0] === 'function'
                && (args[0] as RuleHandler)[Common.HELP_SYMBOL]
            ) {
                return (args[0] as RuleHandler)[Common.HELP_SYMBOL];
            } else {
                return '(no help available)';
            }
        }
    )],

    ['set', Common.injectHelp(
        'set(name, value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'set', 2, 2);
            if (typeof args[0] !== 'string') {
                Common.raise(TypeError, `expect a string as variable name`, env);
            }
            context.set(args[0] as string, args[1] as EvalContextValue);
            return args[1];
        }
    )],

    ['get', Common.injectHelp(
        'get(name)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'get', 1, 1);
            if (typeof args[0] !== 'string') {
                Common.raise(TypeError, `expect a string as variable name`, env);
            }
            if (!context.has(args[0] as string)) {
                Common.raise(ReferenceError, `"${args[0]}" is not defined`, env);
            }
            return context.get(args[0] as string);
        }
    )],

    ['exist', Common.injectHelp(
        'exist(name)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'exist', 1, 1);
            if (typeof args[0] !== 'string') {
                Common.raise(TypeError, `expect a string as variable name`, env);
            }
            return context.has(args[0] as string);
        }
    )],

    ['delete', Common.injectHelp(
        'delete(name)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'delete', 1, 1);
            if (typeof args[0] !== 'string') {
                Common.raise(TypeError, `expect a string as variable name`, env);
            }
            if (!context.has(args[0] as string)) {
                Common.raise(ReferenceError, `"${args[0]}" is not defined`, env);
            }
            context.delete(args[0] as string);
        }
    )],

    ['typeOf', Common.injectHelp(
        'typeOf(value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'typeOf', 1, 1);
            switch (typeof args[0]) {
                case 'number': return 'number';
                case 'string': return 'string';
                case 'boolean': return 'boolean';
                case 'function': return 'function';
                case 'object': {
                    if (!args[0]) {
                        return 'null';
                    } else if (Array.isArray(args[0])) {
                        return 'array';
                    } else if (Common.isDict(args[0])) {
                        return 'dict';
                    }
                }
            }
            Common.raise(TypeError, `unrecognized type`, env);
        }
    )],

    ['print', Common.injectHelp(
        'print(data...)',
        (rawArgs, context, env) => {
            const data = evalList(rawArgs, context, env.fileName);
            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] !== 'string') {
                    Common.raise(TypeError, `expect only strings`, env);
                }
            }
            console.log.apply(null, data);
        }
    )],

    ['sum', Common.injectHelp(
        'sum(x...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'sum', 1, Infinity);
            let result = 0;
            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] !== 'number' || args[i] !== args[i]) {
                    Common.raise(TypeError, `expect finite numbers`, env);
                }
                result += args[i] as number;
            }
            return result;
        }
    )],

    ['substraction', Common.injectHelp(
        'substraction(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'substraction', 2, Infinity);
            let result: number;
            for (let i = 0; i < args.length; i++) {
                if (!Number.isFinite(args[i])) {
                    Common.raise(TypeError, `expect finite numbers`, env);
                }
                if (i) {
                    result! -= args[i] as number;
                } else {
                    result = args[i] as number;
                }
            }
            return result!;
        }
    )],

    ['product', Common.injectHelp(
        'product(x...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'product', 1, Infinity);
            let result = 1;
            for (let i = 0; i < args.length; i++) {
                if (!Number.isFinite(args[i])) {
                    Common.raise(TypeError, `expect finite numbers`, env);
                }
                result *= args[i] as number;
            }
            return result;
        }
    )],

    ['quotient', Common.injectHelp(
        'quotient(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'quotient', 2, Infinity);
            let result: number;
            for (let i = 0; i < args.length; i++) {
                if (!Number.isFinite(args[i])) {
                    Common.raise(TypeError, `expect finite numbers`, env);
                }
                if (i) {
                    result! /= args[i] as number;
                } else {
                    result = args[i] as number;
                }
            }
            return result!;
        }
    )],

    ['mod', Common.injectHelp(
        'mod(a, b)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'mod', 2, 2);
            const a = args[0] as number;
            const b = args[1] as number;
            if (!Number.isFinite(a) || !Number.isFinite(b)) {
                Common.raise(TypeError, `expect finite numbers`, env);
            }
            return a % b;
        }
    )],

    ['pow', Common.injectHelp(
        'pow(x, y)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number, number];
            Common.checkArgs(args, env, 'math.pow', 2, 2);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as base`, env);
            }
            if (args[0] !== args[0]) {
                Common.raise(RangeError, `invalid base`, env);
            }
            if (typeof args[1] !== 'number') {
                Common.raise(TypeError, `expect a number as exponent value`, env);
            }
            if (args[1] !== args[1]) {
                Common.raise(RangeError, `invalid exponent value`, env);
            }
            return Math.pow(args[0], args[1]);
        }
    )],

    ['gt', Common.injectHelp(
        'gt(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'gt', 2, Infinity);
            for (let i = 0; i < args.length; i++) {
                if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                    Common.raise(TypeError, `expect numbers to compare`, env);
                }
            }
            let lastNumber = args[0] as number;
            for (let i = 1; i < args.length; i++) {
                if ((args[i] as number) >= lastNumber) {
                    return false;
                }
                lastNumber = args[i] as number;
            }
            return true;
        }
    )],

    ['gte', Common.injectHelp(
        'gte(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'gte', 2, Infinity);
            for (let i = 0; i < args.length; i++) {
                if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                    Common.raise(TypeError, `expect numbers to compare`, env);
                }
            }
            let lastNumber = args[0] as number;
            for (let i = 1; i < args.length; i++) {
                if ((args[i] as number) > lastNumber) {
                    return false;
                }
                lastNumber = args[i] as number;
            }
            return true;
        }
    )],

    ['lt', Common.injectHelp(
        'lt(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'lt', 2, Infinity);
            for (let i = 0; i < args.length; i++) {
                if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                    Common.raise(TypeError, `expect numbers to compare`, env);
                }
            }
            let lastNumber = args[0] as number;
            for (let i = 1; i < args.length; i++) {
                if ((args[i] as number) <= lastNumber) {
                    return false;
                }
                lastNumber = args[i] as number;
            }
            return true;
        }
    )],

    ['lte', Common.injectHelp(
        'lte(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'lte', 2, Infinity);
            for (let i = 0; i < args.length; i++) {
                if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                    Common.raise(TypeError, `expect numbers to compare`, env);
                }
            }
            let lastNumber = args[0] as number;
            for (let i = 1; i < args.length; i++) {
                if ((args[i] as number) < lastNumber) {
                    return false;
                }
                lastNumber = args[i] as number;
            }
            return true;
        }
    )],

    ['eq', Common.injectHelp(
        'eq(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'eq', 2, Infinity);
            let lastValue = args[0];
            for (let i = 1; i < args.length; i++) {
                if (args[i] !== lastValue) {
                    return false;
                }
                lastValue = args[i];
            }
            return true;
        }
    )],

    ['neq', Common.injectHelp(
        'neq(x0, x1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'neq', 2, Infinity);
            const values = new Set([args[0]]);
            for (let i = 1; i < args.length; i++) {
                if (values.has(args[i])) {
                    return false;
                }
                values.add(args[i]);
            }
            return true;
        }
    )],

    ['not', Common.injectHelp(
        'not(bool)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'not', 1, 1);
            let bool = args[0];
            if (typeof bool !== 'boolean') {
                Common.raise(TypeError, `expect a boolean value`, env);
            }
            return !bool;
        }
    )],

    ['and', Common.injectHelp(
        'and(b0, b1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'and', 2, Infinity);
            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] !== 'boolean') {
                    Common.raise(TypeError, `expect boolean values`, env);
                }
            }
            for (let i = 0; i < args.length; i++) {
                if (!args[i]) {
                    return false;
                }
            }
            return true;
        }
    )],

    ['or', Common.injectHelp(
        'or(b0, b1...)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'or', 2, Infinity);
            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] !== 'boolean') {
                    Common.raise(TypeError, `expect boolean values`, env);
                }
            }
            for (let i = 0; i < args.length; i++) {
                if (args[i]) {
                    return true;
                }
            }
            return false;
        }
    )],

    ['xor', Common.injectHelp(
        'xor(b0, b1)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'xor', 2, 2);
            if (typeof args[0] !== 'boolean' || typeof args[1] !== 'boolean') {
                Common.raise(TypeError, `expect boolean values`, env);
            }
            return args[0] !== args[1];
        }
    )],

    ['number', Common.injectHelp(
        'number(value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'number', 1, 1);
            const type = typeof args[0];
            if (type === 'object' || type === 'function') {
                return NaN;
            } else {
                return Number(args[0]);
            }
        }
    )],

    ['string', Common.injectHelp(
        'string(value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'string', 1, 1);
            return Common.toString(args[0]);
        }
    )],

    ['boolean', Common.injectHelp(
        'boolean(value)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'boolean', 1, 1);
            return Boolean(args[0]);
        }
    )],

]);
