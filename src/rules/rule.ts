import { ASTNode, ASTNodeTemplate, SpanNode, SymbolNode } from '3h-ast';
import { Common, EvalContext, EvalContextValue } from '../common';

export type RulePatternElement =
    | { type?: void; }
    | { type: 'value'; }
    | { type: 'word'; }
    | { type: 'glob'; }
    | { type: 'number'; }
    | { type: 'symbol'; value: string; }
    | { type: 'span'; start: string; };

export type RulePattern = RulePatternElement[];

export type InternalValue = ASTNodeTemplate<'value', {
    value: EvalContextValue;
}>;

export type ExpressionPart = ASTNode | InternalValue;

export interface RuleHandlerEnvironment {
    fileName: string;
    line: number;
    column: number;
}

export interface RuleHandler {
    (parts: readonly ExpressionPart[], context: EvalContext, env: RuleHandlerEnvironment): EvalContextValue | void;
    [Common.HELP_SYMBOL]?: string;
}

export interface Rule {
    pattern: RulePattern;
    handler: RuleHandler;
}

export namespace RuleUtils {

    export const match = (pattern: RulePattern, parts: ExpressionPart[]) => {

        for (let i = 0; i < pattern.length; i++) {

            const element = pattern[i];
            const part = parts[i];

            if (!element.type) {
                continue;
            }

            if (element.type !== part.type) {
                return false;
            }

            if (
                element.type === 'symbol'
                && element.value !== (part as SymbolNode).value
            ) {
                return false;
            }

            if (
                element.type === 'span'
                && element.start !== (part as SpanNode).start
            ) {
                return false;
            }

        }

        return true;

    };

    export const ANY: RulePatternElement = {};

    export const VALUE: RulePatternElement = { type: 'value' };

    export const WORD: RulePatternElement = { type: 'word' };

    export const GLOB: RulePatternElement = { type: 'glob' };

    export const NUMBER: RulePatternElement = { type: 'number' };

    export const BACKQUOTE: RulePatternElement = { type: 'symbol', value: '`' };
    export const TILDE: RulePatternElement = { type: 'symbol', value: '~' };
    export const EXCLAMATION: RulePatternElement = { type: 'symbol', value: '!' };
    export const AT: RulePatternElement = { type: 'symbol', value: '@' };
    export const HASH: RulePatternElement = { type: 'symbol', value: '#' };
    export const DOLLAR: RulePatternElement = { type: 'symbol', value: '$' };
    export const PERCENT: RulePatternElement = { type: 'symbol', value: '%' };
    export const CARRET: RulePatternElement = { type: 'symbol', value: '^' };
    export const AND: RulePatternElement = { type: 'symbol', value: '&' };
    export const STAR: RulePatternElement = { type: 'symbol', value: '*' };
    export const UNDERSCORE: RulePatternElement = { type: 'symbol', value: '_' };
    export const MINUS: RulePatternElement = { type: 'symbol', value: '-' };
    export const PLUS: RulePatternElement = { type: 'symbol', value: '+' };
    export const EQUAL: RulePatternElement = { type: 'symbol', value: '=' };
    export const PIPE: RulePatternElement = { type: 'symbol', value: '|' };
    export const BACKSLASH: RulePatternElement = { type: 'symbol', value: '\\' };
    export const COLON: RulePatternElement = { type: 'symbol', value: ':' };
    export const SEMICOLON: RulePatternElement = { type: 'symbol', value: ';' };
    export const DOUBLE_QUOTE: RulePatternElement = { type: 'symbol', value: '"' };
    export const QUOTE: RulePatternElement = { type: 'symbol', value: "'" };
    export const COMMA: RulePatternElement = { type: 'symbol', value: ',' };
    export const DOT: RulePatternElement = { type: 'symbol', value: '.' };
    export const SLASH: RulePatternElement = { type: 'symbol', value: '/' };
    export const QUESTION: RulePatternElement = { type: 'symbol', value: '?' };

    export const SPAN_PARATHESIS: RulePatternElement = { type: 'span', start: '(' };
    export const SPAN_BRACE: RulePatternElement = { type: 'span', start: '[' };
    export const SPAN_BRACKET: RulePatternElement = { type: 'span', start: '{' };

}
