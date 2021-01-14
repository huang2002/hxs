import { ASTNode } from '3h-ast';
import { Common, EvalContext } from '../common';
import { evalAST, evalList } from '../eval';
import { RuleHandler } from './rule';

export const createFunction = (
    rawArgList: readonly ASTNode[],
    body: readonly ASTNode[],
    creationContext: EvalContext,
    fileName: string,
): RuleHandler => {

    const argList = evalList(rawArgList, creationContext, fileName) as string[];
    for (let i = 0; i < argList.length; i++) {
        if (typeof argList[i] !== 'string') {
            throw new TypeError(
                `expect strings as argument list`
            );
        }
    }

    return (rawArgs, executionContext, env) => {

        const args = evalList(rawArgs, executionContext, env.fileName);
        const scopedContext = new Map(creationContext);

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

        // forward(names)
        let forwardNames = new Array<string>();
        scopedContext.set('forward', (rawValue, _ctx, _env) => {
            const args = evalList(rawValue, _ctx, _env.fileName);
            Common.checkArgs(args, _env, 'forward', 1, 1);
            const names = args[0] as string[];
            if (!Array.isArray(names)) {
                Common.raise(TypeError, `expect an array of strings as variable names`, _env);
            }
            for (let i = 0; i < names.length; i++) {
                if (typeof names[i] !== 'string') {
                    Common.raise(TypeError, `expect an array of strings as variable names`, _env);
                }
            }
            for (let i = 0; i < names.length; i++) {
                forwardNames.push(names[i]);
            }
        });

        try {
            evalAST(body, scopedContext, fileName);
        } catch (error) {
            if (error !== returnFlag) {
                throw error;
            }
        }

        for (let i = 0; i < forwardNames.length; i++) {
            if (scopedContext.has(forwardNames[i])) {
                creationContext.set(
                    forwardNames[i],
                    scopedContext.get(forwardNames[i])!
                );
            }
        }

        return returnValue;

    };

};
