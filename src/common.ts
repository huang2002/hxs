import { RuleHandler } from './rules/rule';

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

    export const checkArgs = (
        args: unknown[],
        fileName: string,
        line: number,
        functionName: string,
        minCount: number,
        maxCount: number,
    ) => {
        if (args.length < minCount) {
            throw new TypeError(
                `too few arguments for function "${functionName}" (file ${fileName} line ${line})`
            );
        }
        if (args.length > maxCount) {
            throw new TypeError(
                `too many arguments for function "${functionName}" (file ${fileName} line ${line})`
            );
        }
    };

    export const isDict = (v: unknown): v is Record<string, unknown> => (
        Object.prototype.toString.call(v) === '[object Object]'
    );

    export const createDict = (dict: Dict): Dict => (
        Object.assign(Object.create(null), dict)
    );

}
