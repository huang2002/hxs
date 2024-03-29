import { ASTNode, ASTNodeTemplate, NumberNode, SymbolNode } from '3h-ast';

export const HELP_SYMBOL = Symbol('hxs-help-symbol');
export const CONSTRUCTOR_SYMBOL = Symbol('hxs-constructor-symbol');
export const BASE_SYMBOL = Symbol('hxs-base-symbol');
export const PROMISE_SYMBOL = Symbol('hxs-promise-symbol');

export type ContextValue =
    | null
    | boolean
    | number
    | string
    | Dict
    | FunctionHandler
    | ContextValue[];

export interface Dict {
    [key: string]: ContextValue;
    [HELP_SYMBOL]?: string;
    [CONSTRUCTOR_SYMBOL]?: ContextValue;
    [BASE_SYMBOL]?: ContextValue;
    [PROMISE_SYMBOL]?: Promise<ContextValue>;
};

export type ValueNode = ASTNodeTemplate<'value', {
    value: ContextValue;
}>;

export type SyntaxNode = ASTNode | ValueNode;

/**
 * absolutePath -> exports
 */
export type ResolvedModules = Record<string, Dict>;

export interface ScriptContext {
    store: Dict;
    exports: Dict;
    resolvedModules: ResolvedModules;
    source: string;
    basePath: string;
    /**
     * [old, ..., new]
     */
    stack: string[];
}

export type SyntaxHandler = (
    buffer: SyntaxNode[],
    index: number,
    context: ScriptContext,
) => void;

export interface FunctionHandler<T extends ContextValue = ContextValue> {
    (
        rawArgs: readonly SyntaxNode[],
        referrer: SyntaxNode,
        context: ScriptContext,
        thisArg: ContextValue,
    ): T;
    [HELP_SYMBOL]?: string;
}

export namespace Utils {

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

    export const normalizeIndex = (
        index: number,
        arraySize: number,
        referrer: SyntaxNode,
        context: ScriptContext,
        allowEnd = false,
    ) => {
        const normalizedIndex = (index as number) < 0
            ? arraySize + (index as number)
            : (index as number);
        if (
            normalizedIndex > arraySize
            || normalizedIndex < 0
            || (!allowEnd && normalizedIndex === arraySize)
        ) {
            const message = `index(${index}) out of range(array size: ${arraySize})`;
            Utils.raise(RangeError, message, referrer, context);
        }
        return normalizedIndex;
    };

    export const formatFrameString = (
        referrer: SyntaxNode,
        context: ScriptContext,
    ) => (
        `    at ${context.source} (Ln ${referrer.line}, Col ${referrer.column})`
    );

    /**
     * Throw a specific error with environment info appended.
     */
    export const raise = (
        constructor: ErrorConstructor,
        message: string,
        referrer: SyntaxNode | null,
        context: ScriptContext | null,
    ) => {
        let errorMessage = message;
        if (referrer && context) {
            const currentFrame = Utils.formatFrameString(referrer, context);
            const { stack } = context;
            if (stack[stack.length - 1] !== currentFrame) {
                errorMessage += '\n' + currentFrame;
            }
            for (let i = stack.length - 1; i >= 0; i--) {
                errorMessage += '\n' + stack[i];
            }
        }
        throw new constructor(errorMessage);
    };

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

    export const isDict = (value: unknown): value is Dict => (
        Object.prototype.toString.call(value) === '[object Object]'
    );

    export const createDict = (dict: Dict): Dict => (
        Object.assign(Object.create(null), dict)
    );

    export const createValueNode = (
        value: ContextValue,
        referrer: SyntaxNode,
    ): ValueNode => ({
        type: 'value',
        line: referrer.line,
        column: referrer.column,
        offset: referrer.offset,
        value,
    });

    export const createRawArray = (
        array: ContextValue[],
        referrer: SyntaxNode,
    ) => {
        const COMMA_NODE: SymbolNode = {
            type: 'symbol',
            value: ',',
            line: referrer.line,
            column: referrer.column,
            offset: referrer.offset,
        };
        const rawArray: SyntaxNode[] = [];
        for (let i = 0; i < array.length; i++) {
            if (i) {
                rawArray.push(COMMA_NODE);
            }
            rawArray.push(
                createValueNode(array[i], referrer)
            );
        }
        return rawArray;
    };

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

    /**
     * Excute the callback with the temporary variables
     * defined in context store and recover conflicting
     * variables after execution.
     */
    export const injectTemp = (
        store: Dict,
        variables: Dict,
        callback: () => void,
    ) => {
        const copy = Object.create(null) as Dict;
        for (const key in variables) {
            if (key in store) {
                copy[key] = store[key];
            }
            store[key] = variables[key];
        }
        callback();
        for (const key in variables) {
            if (key in copy) {
                store[key] = copy[key];
            } else {
                delete store[key];
            }
        }
    };

    export const extendContext = (
        context: ScriptContext,
        store: Dict,
        stack: string[],
    ): ScriptContext => ({
        store,
        exports: context.exports,
        resolvedModules: context.resolvedModules,
        source: context.source,
        basePath: context.basePath,
        stack,
    });

    export const injectHelp = <T>(helpInfo: string, target: T) => {
        (target as any)[HELP_SYMBOL] = helpInfo;
        return target;
    };

    export const toString = (
        value: ContextValue,
        previewSize = 10,
        previewIndent = '  ',
    ): string => {

        const type = typeof value;

        if (type === 'string') {

            return value as string;

        } else if (type === 'function') {

            return '<function>';

        } else if (Array.isArray(value)) {

            if (previewSize <= 0) {
                return '<array>';
            }

            let result = `(size: ${value.length}) [`;

            if (value.length > 0) {
                result += '\n' + previewIndent;
                result += value.slice(0, previewSize)
                    .map(v => (toDisplay(v, 0) + ',\n'))
                    .join(previewIndent);
            }
            if (value.length > previewSize) {
                result += previewIndent + '...\n';
            }
            result += ']';

            return result;

        } else if (isDict(value)) {

            if (previewSize <= 0) {
                return '<dict>';
            }

            const entries = Object.entries(value);
            let result = `(size: ${entries.length}) {`;

            if (entries.length > 0) {
                result += '\n' + previewIndent;
                result += entries.slice(0, previewSize)
                    .map(entry => (
                        toDisplay(entry[0], 0)
                        + ' -> '
                        + toDisplay(entry[1], 0)
                        + ',\n'
                    ))
                    .join(previewIndent);
                if (entries.length > previewSize) {
                    result += previewIndent + '...\n';
                }
            }

            result += '}';

            return result;

        } else {

            return String(value);

        }

    };

    export const toDisplay = (
        value: ContextValue,
        previewSize?: number,
        previewIndent?: string,
    ): string => {
        if (typeof value !== 'string') {
            return toString(value, previewSize, previewIndent);
        }
        if (!value.includes("'")) {
            return "'" + value + "'";
        } else if (!value.includes('"')) {
            return '"' + value + '"';
        } else if (!value.includes('`')) {
            return '`' + value + '`';
        } else {
            return "'" + value.replace(/'/g, "\\'") + "'";
        }
    };

    export const filterValue = (value: unknown): ContextValue => {
        if (value === undefined) {
            return null;
        } else if (value && typeof value === 'object') {
            if (isDict(value)) {
                return value;
            } else {
                return String(value);
            }
        } else {
            return value as ContextValue;
        }
    };

}
