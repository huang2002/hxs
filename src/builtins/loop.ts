import { Common } from '../common';
import { evalAST, evalList } from '../eval';
import { RuleHandler } from '../rules/rule';

// for (cursorName, start, end, step?) {...}
export const builtinFor: RuleHandler = (rawArgs, context, env): RuleHandler => {

    const args = evalList(rawArgs, context, env.fileName);
    Common.checkArgs(args, env, 'for', 3, 4);

    const cursorName = args[0] as string;
    if (typeof cursorName !== 'string') {
        Common.raise(TypeError, `expect a string as cursor name`, env);
    }

    const start = args[1] as number;
    if (!Number.isFinite(start)) {
        Common.raise(TypeError, `expect a finite number as start value`, env);
    }

    const end = args[2] as number;
    if (!Number.isFinite(end)) {
        Common.raise(TypeError, `expect a finite number as end value`, env);
    }

    const defaultStep = start <= end ? 1 : -1;
    const step = args.length === 4
        ? args[3] as number
        : defaultStep;
    if (!Number.isFinite(end)) {
        Common.raise(TypeError, `expect a finite number as step`, env);
    }
    if (start !== end && Math.sign(defaultStep) !== Math.sign(step)) {
        Common.raise(RangeError, `invalid step`, env);
    }

    return (rawBlock, ctx, _env) => {
        const blocks = evalList(rawBlock, ctx, _env.fileName) as [RuleHandler];
        if (blocks.length !== 1 || typeof blocks[0] !== 'function') {
            Common.raise(TypeError, `expect exactly one code block`, env);
        }
        const oldBreak = ctx.get('break');
        const breakFlag = Symbol('breakFlag');
        const oldContinue = ctx.get('continue');
        const continueFlag = Symbol('continueFlag');
        ctx.set('break', () => { throw breakFlag; });
        ctx.set('continue', () => { throw continueFlag; });
        try {
            for (let i = start; i < end; i += step) {
                ctx.set(cursorName, i);
                try {
                    blocks[0]([], ctx, _env);
                } catch (err) {
                    if (err !== continueFlag) {
                        throw err;
                    }
                }
            }
        } catch (error) {
            if (error !== breakFlag) {
                throw error;
            }
        }
        if (oldBreak === undefined) {
            ctx.delete('break');
        } else {
            ctx.set('break', oldBreak);
        }
        if (oldContinue === undefined) {
            ctx.delete('continue');
        } else {
            ctx.set('continue', oldContinue);
        }
    };

};

// while (condition) {...}
export const builtinWhile: RuleHandler = (rawArgs): RuleHandler => (
    (rawBlock, ctx, env) => {
        const blocks = evalList(rawBlock, ctx, env.fileName) as [RuleHandler];
        if (blocks.length !== 1 || typeof blocks[0] !== 'function') {
            Common.raise(TypeError, `expect exactly one code block`, env);
        }
        const oldBreak = ctx.get('break');
        const breakFlag = Symbol('breakFlag');
        const oldContinue = ctx.get('continue');
        const continueFlag = Symbol('continueFlag');
        ctx.set('break', () => { throw breakFlag; });
        ctx.set('continue', () => { throw continueFlag; });
        try {
            while (true) {
                const condition = evalAST(rawArgs, ctx, env.fileName);
                if (typeof condition !== 'boolean') {
                    Common.raise(TypeError, `expect a boolean as condition`, env);
                }
                if (!condition) {
                    break;
                }
                try {
                    blocks[0]([], ctx, env);
                } catch (err) {
                    if (err !== continueFlag) {
                        throw err;
                    }
                }
            }
        } catch (error) {
            if (error !== breakFlag) {
                throw error;
            }
        }
        if (oldBreak === undefined) {
            ctx.delete('break');
        } else {
            ctx.set('break', oldBreak);
        }
        if (oldContinue === undefined) {
            ctx.delete('continue');
        } else {
            ctx.set('continue', oldContinue);
        }
    }
);
