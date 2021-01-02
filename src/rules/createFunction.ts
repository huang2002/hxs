import { ASTNode } from '3h-ast';
import { EvalContext } from '../common';
import { evalAST, evalList } from '../eval';
import { RuleHandler } from './rule';

export const createFunction = (
    rawArgList: readonly ASTNode[],
    body: readonly ASTNode[],
    context: EvalContext,
    fileName: string,
): RuleHandler => {
    const argList = evalList(rawArgList, context, fileName) as string[];
    for (let i = 0; i < argList.length; i++) {
        if (typeof argList[i] !== 'string') {
            throw new TypeError(
                `expect strings as argument list`
            );
        }
    }
    return (rawArgs, ctx, _fileName) => {
        const args = evalList(rawArgs, ctx, _fileName);
        const scopedContext = new Map(context);
        scopedContext.set('arguments', args);
        for (let i = 0; i < argList.length; i++) {
            scopedContext.set(
                argList[i],
                i < args.length ? args[i] : null
            );
        }
        const returnFlag = Symbol('returnFlag');
        let returnValue = null;
        scopedContext.set('return', (rawValue, _ctx) => {
            if (rawValue.length) {
                const value = evalList(rawValue, _ctx, _fileName);
                returnValue = value[value.length - 1];
            }
            throw returnFlag;
        });
        try {
            evalAST(body, scopedContext, fileName);
        } catch (error) {
            if (error !== returnFlag) {
                throw error;
            }
        }
        return returnValue;
    };
};
