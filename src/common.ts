import { RuleHandler, RuleHandlerEnvironment } from './rules/rule';

export type EvalContextValue =
    | null
    | boolean
    | number
    | string
    | { [key: string]: EvalContextValue; } // Dict
    | RuleHandler
    | EvalContextValue[];

export type Dict = Record<string, EvalContextValue>;

export type EvalContext = Map<string, EvalContextValue>;

export namespace Common {

    export const raise = (
        constructor: ErrorConstructor,
        msg: string,
        env: RuleHandlerEnvironment,
    ): never => {
        throw new constructor(
            msg + ` (${env.fileName} line ${env.line} column ${env.column})`
        );
    };

    export const checkArgs = (
        args: unknown[],
        env: RuleHandlerEnvironment,
        functionName: string,
        minCount: number,
        maxCount: number,
    ) => {
        if (args.length < minCount) {
            raise(TypeError, `too few arguments for function "${functionName}"`, env);
        }
        if (args.length > maxCount) {
            raise(TypeError, `too many arguments for function "${functionName}"`, env);
        }
    };

    export const isDict = (v: unknown): v is Record<string, unknown> => (
        Object.prototype.toString.call(v) === '[object Object]'
    );

    export const createDict = (dict: Dict): Dict => (
        Object.assign(Object.create(null), dict)
    );

    export const toString = (value: unknown, shallow?: boolean) => {
        const type = typeof value;
        if (type === 'string') {
            if (!(value as string).includes("'")) {
                return "'" + value + "'";
            } else if (!(value as string).includes('"')) {
                return '"' + value + '"';
            } else if (!(value as string).includes('`')) {
                return '`' + value + '`';
            } else {
                return "'" + (value as string).replace(/'/g, "\\'") + "'";
            }
        } else if (type === 'function') {
            return '<function>';
        } else if (Array.isArray(value)) {
            if (shallow) {
                return '<array>';
            }
            let result = `(size: ${value.length}) [`;
            if (value.length <= 10) {
                result += value.map(v => toString(v, true))
                    .join(', ');
            } else {
                result += value.slice(0, 10)
                    .map(v => toString(v, true))
                    .join(', ')
                    + ', ...';
            }
            result += ']';
            return result;
        } else if (Common.isDict(value)) {
            return '<dict>';
        }
        return String(value);
    };

    export const HELP_SYMBOL = Symbol('hxs-help');

    export const injectHelp = (help: string, target: RuleHandler) => {
        target[HELP_SYMBOL] = help;
        return target;
    };

}
