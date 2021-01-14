import { ASTNode } from '3h-ast';
import { Common, EvalContext } from '../common';
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

    return (rawArgs, ctx, env) => {

        const args = evalList(rawArgs, ctx, env.fileName);
        const scopedContext = new Map(context);

        scopedContext.set('arguments', args);

        for (let i = 0; i < argList.length; i++) {
            scopedContext.set(
                argList[i],
                i < args.length ? args[i] : null
            );
        }

        // return(value)
        const returnFlag = Symbol('returnFlag');
        let returnValue = null;
        scopedContext.set('return', (rawValue, _ctx, _env) => {
            if (rawValue.length) {
                const args = evalList(rawValue, _ctx, _env.fileName);
                Common.checkArgs(args, _env, 'return', 0, 1);
                returnValue = args[0];
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
