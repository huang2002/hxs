import { parse } from '3h-ast';
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

    const buffer = new Array<ExpressionPart>();
    let candidateRules = new Array<Rule>();
    let breakFlag = false;

    for (let i = 0; i < ast.length; i++) {

        const node = ast[i];
        const semicolonFlag = node.type === 'symbol' && node.value === ';';

        const matchedRules = [];
        if (!semicolonFlag) {
            buffer.push(node);
            const candidates = candidateRules.length ? candidateRules : rules;
            for (let j = 0; j < candidates.length; j++) {
                const rule = candidates[j];
                if (
                    rule.pattern.length === buffer.length
                    && RuleUtils.match(rule.pattern, buffer)
                ) {
                    matchedRules.push(rule);
                }
            }
        }

        if (!buffer.length) { // ignore extra semicolons
            continue;
        }

        if (!matchedRules.length) {

            if (!candidateRules.length) {
                if (buffer.length === 1 && buffer[0].type === 'value') {
                    buffer.length = 0; // ignore single values
                } else if (semicolonFlag) {
                    breakFlag = true;
                    break;
                }
                continue;
            }

            if (!semicolonFlag) {
                buffer.pop();
            }

            const value = candidateRules[0].handler(
                buffer,
                context,
                {
                    fileName,
                    line: buffer[0].line,
                    column: buffer[0].column,
                },
            );

            if (semicolonFlag) {
                buffer.length = 0;
            } else {
                buffer.length = 1;
                buffer[0] = {
                    type: 'value',
                    value: value !== undefined ? value : null,
                    offset: buffer[0].offset,
                    line: buffer[0].line,
                    column: buffer[0].column,
                };
            }

            if (!semicolonFlag) {
                buffer.push(node);
            }

            candidateRules = [];

        } else if (matchedRules.length === 1 || semicolonFlag) {

            const value = matchedRules[0].handler(
                buffer,
                context,
                {
                    fileName,
                    line: buffer[0].line,
                    column: buffer[0].column,
                },
            );
            buffer.length = 1;
            buffer[0] = {
                type: 'value',
                value: value !== undefined ? value : null,
                offset: buffer[0].offset,
                line: buffer[0].line,
                column: buffer[0].column,
            };
            candidateRules = [];

        } else {
            candidateRules = matchedRules;
        }

    }

    if (buffer.length === 0) {
        return null;
    }

    if (
        !breakFlag
        && buffer.length === 1
        && buffer[0].type === 'value'
    ) {
        return buffer[0].value;
    }

    if (candidateRules.length !== 1) {
        Common.raise(SyntaxError, `unrecognized syntax`, {
            fileName,
            line: buffer[buffer.length - 1].line,
            column: buffer[buffer.length - 1].column,
        });
    }

    const value = candidateRules[0].handler(
        buffer,
        context,
        {
            fileName,
            line: buffer[0].line,
            column: buffer[0].column,
        },
    );

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
