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

}
