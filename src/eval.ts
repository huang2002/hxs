import { parse, SymbolNode } from '3h-ast';
import { builtins } from './builtins/builtins';
import { Common, EvalContext, EvalContextValue } from './common';
import { ExpressionPart, Rule, RuleUtils } from './rules/rule';
import { rules } from './rules/rules';

export const evalAST = (
    ast: readonly ExpressionPart[],
    context: EvalContext,
    fileName: string,
): EvalContextValue => {

    if (!ast.length) {
        return null;
    }

    if (ast.length === 1 && ast[0].type === 'value') {
        return ast[0].value !== undefined ? ast[0].value : null;
    }

    let cursor = 0;
    while (
        ast[cursor].type === 'symbol'
        && (ast[cursor] as SymbolNode).value === ';'
    ) {
        cursor++;
        if (cursor >= ast.length) {
            return null;
        }
    }

    const buffer = [ast[cursor]];
    let candidateRules = rules as readonly Rule[];
    let matchedRules: Rule[];
    let breakFlag = false;

    while (cursor < ast.length) {

        if (
            buffer[buffer.length - 1].type === 'symbol'
            && (buffer[buffer.length - 1] as SymbolNode).value === ';'
            && (
                buffer.length === 1
                || (buffer.length === 2 && buffer[0].type === 'value')
            )
        ) {
            cursor++;
            if (cursor < ast.length) {
                buffer[0] = ast[cursor];
                buffer.length = 1;
            } else {
                buffer.length = 0;
            }
            continue;
        }

        matchedRules = [];
        for (let i = 0; i < candidateRules.length; i++) {
            if (RuleUtils.match(candidateRules[i].pattern, buffer)) {
                matchedRules.push(candidateRules[i]);
            }
        }

        if (!matchedRules.length) {

            if (!candidateRules.length || candidateRules === rules) {
                breakFlag = true;
                break;
            }

            if (buffer.length > 1) {
                let tempNode = buffer.pop()!;

                let matchedIndex = -1;
                for (let i = 0; i < candidateRules.length; i++) {
                    if (candidateRules[i].pattern.length === buffer.length) {
                        matchedIndex = i;
                        break;
                    }
                }

                if (matchedIndex === -1) {
                    breakFlag = true;
                    break;
                }

                const value = candidateRules[matchedIndex].handler(
                    buffer,
                    context,
                    {
                        line: buffer[0].line,
                        column: buffer[0].column,
                        fileName,
                    }
                );
                buffer[0] = {
                    type: 'value',
                    line: buffer[0].line,
                    column: buffer[0].column,
                    offset: buffer[0].offset,
                    value: value === undefined ? null : value,
                };
                buffer.length = 1;
                candidateRules = rules;

                if (tempNode.type === 'symbol' && tempNode.value === ';') {
                    buffer.length = 0;
                } else {
                    buffer.push(tempNode);
                    continue;
                }

            }

        } else if (
            matchedRules.length === 1
            && matchedRules[0].pattern.length === buffer.length
        ) {
            const value = matchedRules[0].handler(
                buffer,
                context,
                {
                    line: buffer[0].line,
                    column: buffer[0].column,
                    fileName,
                }
            );
            buffer.length = 1;
            buffer[0] = {
                type: 'value',
                line: buffer[0].line,
                column: buffer[0].column,
                offset: buffer[0].offset,
                value: value === undefined ? null : value,
            };
            candidateRules = rules;
        } else {
            candidateRules = matchedRules;
        }

        cursor++;
        if (cursor < ast.length) {
            buffer.push(ast[cursor]);
        }

    };

    if (!buffer.length) {
        return null;
    }

    if (buffer.length === 1 && buffer[0].type === 'value') {
        return buffer[0].value;
    }

    let matchedIndex = -1;
    if (!breakFlag) {
        for (let i = 0; i < candidateRules.length; i++) {
            if (candidateRules[i].pattern.length === buffer.length) {
                matchedIndex = i;
                break;
            }
        }
    }

    if (matchedIndex === -1) {
        Common.raise(SyntaxError, 'unrecognized syntax', {
            line: buffer[0].line,
            column: buffer[0].column,
            fileName,
        });
    }

    const value = candidateRules[matchedIndex].handler(buffer, context, {
        line: buffer[0].line,
        column: buffer[0].column,
        fileName,
    });

    return value !== undefined ? value : null;

};

export const evalList = (
    list: readonly ExpressionPart[],
    context: EvalContext,
    fileName: string,
) => {
    const result = [];
    const buffer = [];
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (element.type === 'symbol' && element.value === ',') {
            if (buffer.length) {
                const value = evalAST(buffer, context, fileName);
                result.push(value);
                buffer.length = 0;
            } else {
                result.push(null);
            }
        } else {
            buffer.push(element);
        }
    }
    if (buffer.length) {
        const value = evalAST(buffer, context, fileName);
        result.push(value); // last element
    }
    return result as EvalContextValue[];
};

export const evalCode = (
    code: string,
    context = new Map(builtins),
    fileName = 'unknown',
) => (
    evalAST(parse(code).ast, context, fileName)
);
