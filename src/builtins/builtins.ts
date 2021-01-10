import { Common, EvalContext, EvalContextValue } from '../common';
import { evalList } from '../eval';
import { ExpressionPart, RuleHandler } from '../rules/rule';
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

    // set(name, value)
    ['set', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'set', 2, 2);
        if (typeof args[0] !== 'string') {
            Common.raise(TypeError, `expect a string as variable name`, env);
        }
        context.set(args[0] as string, args[1] as EvalContextValue);
        return args[1];
    }],

    // get(name)
    ['get', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'get', 1, 1);
        if (typeof args[0] !== 'string') {
            Common.raise(TypeError, `expect a string as variable name`, env);
        }
        if (!context.has(args[0] as string)) {
            Common.raise(ReferenceError, `"${args[0]}" is not defined`, env);
        }
        return context.get(args[0] as string);
    }],

    // exist(name)
    ['exist', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'exist', 1, 1);
        if (typeof args[0] !== 'string') {
            Common.raise(TypeError, `expect a string as variable name`, env);
        }
        return context.has(args[0] as string);
    }],

    // delete(name)
    ['delete', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'delete', 1, 1);
        if (typeof args[0] !== 'string') {
            Common.raise(TypeError, `expect a string as variable name`, env);
        }
        if (!context.has(args[0] as string)) {
            Common.raise(ReferenceError, `"${args[0]}" is not defined`, env);
        }
        context.delete(args[0] as string);
    }],

    // invoke(f, args)
    ['invoke', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'exist', 2, 2);
        const f = args[0] as RuleHandler;
        if (typeof f !== 'function') {
            Common.raise(TypeError, `expect a function as the first argument`, env);
        }
        const rawArgList = args[1] as unknown[];
        if (!Array.isArray(rawArgList)) {
            Common.raise(TypeError, `expect an array as argument list`, env);
        }
        const argList = new Array<ExpressionPart>();
        for (let i = 0; i < rawArgList.length; i++) {
            if (i) {
                argList.push({
                    type: 'symbol',
                    value: ',',
                    offset: NaN,
                    line: env.line,
                    column: NaN,
                });
            }
            argList.push({
                type: 'value',
                value: rawArgList[i],
                offset: NaN,
                line: env.line,
                column: NaN,
            });
        }
        return f(argList, context, env);
    }],

    // pipe(data, functions)
    ['pipe', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'pipe', 2, 2);
        const functions = args[1] as RuleHandler[];
        if (!Array.isArray(functions)) {
            Common.raise(TypeError, `expect an array of functions as the second argument`, env);
        }
        for (let i = 0; i < functions.length; i++) {
            if (typeof functions[i] !== 'function') {
                Common.raise(TypeError, `expect an array of functions as the second argument`, env);
            }
        }
        let data = args[0] as unknown;
        for (let i = 0; i < functions.length; i++) {
            data = functions[i](
                [{
                    type: 'value',
                    value: data,
                    offset: NaN,
                    line: env.line,
                    column: NaN,
                }],
                context,
                env,
            );
        }
        return data;
    }],

    // print(data...)
    ['print', (rawArgs, context, env) => {
        console.log.apply(null, evalList(rawArgs, context, env.fileName));
    }],

    // sum(x...)
    ['sum', (rawArgs, context, env) => {
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
    }],

    // substraction(x0, x1...)
    ['substraction', (rawArgs, context, env) => {
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
    }],

    // product(x...)
    ['product', (rawArgs, context, env) => {
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
    }],

    // quotient(x0, x1...)
    ['quotient', (rawArgs, context, env) => {
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
    }],

    // mod(a, b)
    ['mod', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'mod', 2, 2);
        const a = args[0] as number;
        const b = args[1] as number;
        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            Common.raise(TypeError, `expect finite numbers`, env);
        }
        return a % b;
    }],

    // pow(x,y)
    ['pow', (rawArgs, context, env) => {
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
    }],

    // gt(x0, x1...)
    ['gt', (rawArgs, context, env) => {
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
    }],

    // gte(x0, x1...)
    ['gte', (rawArgs, context, env) => {
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
    }],

    // lt(x0, x1...)
    ['lt', (rawArgs, context, env) => {
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
    }],

    // lte(x0, x1...)
    ['lte', (rawArgs, context, env) => {
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
    }],

    // eq(x0, x1...)
    ['eq', (rawArgs, context, env) => {
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
    }],

    // not(bool)
    ['not', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'not', 1, 1);
        let bool = args[0];
        if (typeof bool !== 'boolean') {
            Common.raise(TypeError, `expect a boolean value`, env);
        }
        return !bool;
    }],

    // and(b0, b1...)
    ['and', (rawArgs, context, env) => {
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
    }],

    // or(b0, b1...)
    ['or', (rawArgs, context, env) => {
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
    }],

    // number(value)
    ['number', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'number', 1, 1);
        return Number(args[0]);
    }],

    // string(value)
    ['string', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'string', 1, 1);
        if (typeof args[0] === 'function') {
            return '<function>';
        }
        return String(args[0]);
    }],

    // boolean(value)
    ['boolean', (rawArgs, context, env) => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'boolean', 1, 1);
        return Boolean(args[0]);
    }],

]);
