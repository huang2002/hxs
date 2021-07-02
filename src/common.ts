import { ASTNode, ASTNodeTemplate, NumberNode } from '3h-ast';

export const HELP_SYMBOL = Symbol('hxs_help_symbol');
/** dts2md break */
export type ContextValue =
    | null
    | boolean
    | number
    | string
    | Dict
    | FunctionHandler
    | ContextValue[];
/** dts2md break */
export interface Dict {
    [key: string]: ContextValue;
    [HELP_SYMBOL]?: string;
};
/** dts2md break */
export type ContextStore = Map<string, ContextValue>;
/** dts2md break */
export type ValueNode = ASTNodeTemplate<'value', {
    value: ContextValue;
}>;
/** dts2md break */
export type SyntaxNode = ASTNode | ValueNode;
/** dts2md break */
export interface ScriptContext {
    store: ContextStore;
    source: string;
}
/** dts2md break */
export type SyntaxHandler = (
    buffer: SyntaxNode[],
    index: number,
    context: ScriptContext,
) => void;
/** dts2md break */
export interface FunctionHandler {
    (args: readonly SyntaxNode[], referer: SyntaxNode, context: ScriptContext): ContextValue;
    [HELP_SYMBOL]?: string;
}
/** dts2md break */
export namespace Utils {
    /** dts2md break */
    /**
     * A stable in-place sorting function.
     */
    export const sort = <T>(array: T[], compare: (a: T, b: T) => number) => {
        let t;
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (compare(array[i], array[j]) > 0) {
                    t = array[i];
                    array[i] = array[j];
                    array[j] = t;
                }
            }
        }
    };
    /** dts2md break */
    /**
     * Remove specific element(s) from the array.
     * (Default count: `array.length - start`)
     */
    export const removeElements = (
        array: any[],
        start: number,
        count = array.length - start,
    ) => {
        for (let i = start; i < array.length - count; i++) {
            array[i] = array[i + count];
        }
        array.length -= count;
    };
    /** dts2md break */
    /**
     * Throw a specific error with environment info appended.
     */
    export const raise = (
        constructor: ErrorConstructor,
        message: string,
        referer: SyntaxNode,
        context: ScriptContext,
    ) => {
        const { line, column } = referer;
        const { source } = context;
        throw new constructor(
            `${message} (Ln ${line}, Col ${column} @${source})`
        );
    };
    /** dts2md break */
    export const parseNumber = (
        node: NumberNode,
        context: ScriptContext,
    ) => {
        let result!: number;
        switch (node.suffix) {
            case 'D':
            case '': {
                result = +node.value;
                break;
            }
            case 'B': {
                result = Number.parseInt(node.value, 2);
                break;
            }
            case 'O': {
                result = Number.parseInt(node.value, 8);
                break;
            }
            case 'H': {
                result = Number.parseInt(node.value, 16);
                break;
            }
            default: {
                Utils.raise(SyntaxError, 'unrecognized number', node, context);
            }
        }
        if (result !== result) { // NaN
            Utils.raise(SyntaxError, 'invalid number', node, context);
        }
        return result;
    };
    /** dts2md break */
    export const isDict = (value: unknown): value is Dict => (
        Object.prototype.toString.call(value) === '[object Object]'
    );
    /** dts2md break */
    export const createDict = (dict: Dict): Dict => (
        Object.assign(Object.create(null), dict)
    );
    /** dts2md break */
    export const createValueNode = (
        value: ContextValue,
        referer: SyntaxNode,
    ): ValueNode => ({
        type: 'value',
        line: referer.line,
        column: referer.column,
        offset: referer.offset,
        value,
    });
    /** dts2md break */
    export const replaceBuffer = (
        buffer: SyntaxNode[],
        start: number,
        width: number,
        replacement: SyntaxNode,
    ) => {
        buffer[start] = replacement;
        if (width > 1) {
            removeElements(buffer, start + 1, width - 1);
        }
    };
    /** dts2md break */
    /**
     * Excute the callback with the temporary variables
     * defined in context store and recover conflicting
     * variables after execution.
     */
    export const injectTemp = (
        store: ContextStore,
        variables: Dict,
        callback: () => void,
    ) => {
        const copy = Object.create(null) as Dict;
        for (const key in variables) {
            if (store.has(key)) {
                copy[key] = store.get(key)!;
            }
            store.set(key, variables[key]);
        }
        callback();
        for (const key in variables) {
            if (key in copy) {
                store.set(key, copy[key]);
            } else {
                store.delete(key);
            }
        }
    };
    /** dts2md break */
    export const injectHelp = <T>(helpInfo: string, target: T) => {
        (target as any)[HELP_SYMBOL] = helpInfo;
        return target;
    };
    /** dts2md break */
    export const toString = (value: ContextValue, shallow = false): string => {

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

        } else if (isDict(value)) {

            return '<dict>';

        } else {

            return String(value);

        }

    };

}
