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
    ['set', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'set', 2, 2);
        if (typeof args[0] !== 'string') {
            throw new TypeError(
                `expect a string as variable name (file ${fileName} line ${line})`
            );
        }
        context.set(args[0], args[1] as EvalContextValue);
        return args[1];
    }],

    // get(name)
    ['get', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'get', 1, 1);
        if (typeof args[0] !== 'string') {
            throw new TypeError(
                `expect a string as variable name (file ${fileName} line ${line})`
            );
        }
        if (!context.has(args[0])) {
            throw new ReferenceError(
                `"${args[0]}" is not defined (file ${fileName} line ${line})`
            );
        }
        return context.get(args[0]);
    }],

    // exist(name)
    ['exist', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'exist', 1, 1);
        if (typeof args[0] !== 'string') {
            throw new TypeError(
                `expect a string as variable name (file ${fileName} line ${line})`
            );
        }
        return context.has(args[0]);
    }],

    // delete(name)
    ['delete', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'delete', 1, 1);
        if (typeof args[0] !== 'string') {
            throw new TypeError(
                `expect a string as variable name (file ${fileName} line ${line})`
            );
        }
        if (!context.has(args[0])) {
            throw new ReferenceError(
                `"${args[0]}" is not defined (file ${fileName} line ${line})`
            );
        }
        context.delete(args[0]);
    }],

    // invoke(f, args)
    ['invoke', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'exist', 2, 2);
        const f = args[0];
        if (typeof f !== 'function') {
            throw new TypeError(
                `expect a function as the first argument (file ${fileName} line ${line})`
            );
        }
        const rawArgList = args[1];
        if (!Array.isArray(rawArgList)) {
            throw new TypeError(
                `expect an array as argument list (file ${fileName} line ${line})`
            );
        }
        const argList = new Array<ExpressionPart>();
        for (let i = 0; i < rawArgList.length; i++) {
            if (i) {
                argList.push({
                    type: 'symbol',
                    value: ',',
                    offset: NaN,
                    line,
                });
            }
            argList.push({
                type: 'value',
                value: rawArgList[i],
                offset: NaN,
                line,
            });
        }
        return f(argList, context, fileName, line);
    }],

    // pipe(data, functions)
    ['pipe', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'pipe', 2, 2);
        const functions = args[1] as RuleHandler[];
        if (!Array.isArray(functions)) {
            throw new TypeError(
                `expect an array of functions as the second argument (file ${fileName} line ${line})`
            );
        }
        for (let i = 0; i < functions.length; i++) {
            if (typeof functions[i] !== 'function') {
                throw new TypeError(
                    `expect an array of functions as the second argument (file ${fileName} line ${line})`
                );
            }
        }
        let data = args[0] as unknown;
        for (let i = 0; i < functions.length; i++) {
            data = functions[i](
                [{
                    type: 'value',
                    value: data,
                    offset: NaN,
                    line,
                }],
                context,
                fileName,
                line,
            );
        }
        return data;
    }],

    // print(data...)
    ['print', (rawArgs, context, fileName) => {
        console.log.apply(null, evalList(rawArgs, context, fileName));
    }],

    // sum(x...)
    ['sum', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'sum', 1, Infinity);
        let result = 0;
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] !== 'number' || args[i] !== args[i]) {
                throw new TypeError(
                    `expect finite numbers (file ${fileName} line ${line})`
                );
            }
            result += args[i] as number;
        }
        return result;
    }],

    // substraction(x0, x1...)
    ['substraction', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'substraction', 2, Infinity);
        let result: number;
        for (let i = 0; i < args.length; i++) {
            if (!Number.isFinite(args[i])) {
                throw new TypeError(
                    `expect finite numbers (file ${fileName} line ${line})`
                );
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
    ['product', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'product', 1, Infinity);
        let result = 1;
        for (let i = 0; i < args.length; i++) {
            if (!Number.isFinite(args[i])) {
                throw new TypeError(
                    `expect finite numbers (file ${fileName} line ${line})`
                );
            }
            result *= args[i] as number;
        }
        return result;
    }],

    // quotient(x0, x1...)
    ['quotient', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'quotient', 2, Infinity);
        let result: number;
        for (let i = 0; i < args.length; i++) {
            if (!Number.isFinite(args[i])) {
                throw new TypeError(
                    `expect finite numbers (file ${fileName} line ${line})`
                );
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
    ['mod', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'mod', 2, 2);
        const a = args[0] as number;
        const b = args[1] as number;
        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            throw new TypeError(
                `expect finite numbers (file ${fileName} line ${line})`
            );
        }
        return a % b;
    }],

    // gt(x0, x1...)
    ['gt', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'gt', 2, Infinity);
        for (let i = 0; i < args.length; i++) {
            if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                throw new TypeError(
                    `expect numbers to compare (file ${fileName} line ${line})`
                );
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
    ['gte', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'gte', 2, Infinity);
        for (let i = 0; i < args.length; i++) {
            if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                throw new TypeError(
                    `expect numbers to compare (file ${fileName} line ${line})`
                );
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
    ['lt', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'lt', 2, Infinity);
        for (let i = 0; i < args.length; i++) {
            if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                throw new TypeError(
                    `expect numbers to compare (file ${fileName} line ${line})`
                );
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
    ['lte', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'lte', 2, Infinity);
        for (let i = 0; i < args.length; i++) {
            if (typeof args[0] !== 'number' || args[0] !== args[0]) {
                throw new TypeError(
                    `expect numbers to compare (file ${fileName} line ${line})`
                );
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
    ['eq', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'eq', 2, Infinity);
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
    ['not', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'not', 1, 1);
        let bool = args[0];
        if (typeof bool !== 'boolean') {
            throw new TypeError(
                `expect a boolean value (file ${fileName} line ${line})`
            );
        }
        return !bool;
    }],

    // and(b0, b1...)
    ['and', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'and', 2, Infinity);
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] !== 'boolean') {
                throw new TypeError(
                    `expect boolean values (file ${fileName} line ${line})`
                );
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
    ['or', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'or', 2, Infinity);
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] !== 'boolean') {
                throw new TypeError(
                    `expect boolean values (file ${fileName} line ${line})`
                );
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
    ['number', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'number', 1, 1);
        return Number(args[0]);
    }],

    // string(value)
    ['string', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'string', 1, 1);
        if (typeof args[0] === 'function') {
            return '<function>';
        }
        return String(args[0]);
    }],

    // boolean(value)
    ['boolean', (rawArgs, context, fileName, line) => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'boolean', 1, 1);
        return Boolean(args[0]);
    }],

]);
