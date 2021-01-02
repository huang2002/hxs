import { Common } from '../common';
import { evalAST, evalList } from '../eval';
import { RuleHandler } from '../rules/rule';

// for (cursorName, start, end, step?) {...}
export const builtinFor: RuleHandler = (rawArgs, context, fileName, line): RuleHandler => {

    const args = evalList(rawArgs, context, fileName);
    Common.checkArgs(args, fileName, line, 'for', 3, 4);

    const cursorName = args[0];
    if (typeof cursorName !== 'string') {
        throw new TypeError(
            `expect a string as cursor name (file ${fileName} line ${line})`
        );
    }

    const start = args[1] as number;
    if (!Number.isFinite(start)) {
        throw new TypeError(
            `expect a finite number as start value (file ${fileName} line ${line})`
        );
    }

    const end = args[2] as number;
    if (!Number.isFinite(end)) {
        throw new TypeError(
            `expect a finite number as end value (file ${fileName} line ${line})`
        );
    }

    const defaultStep = start <= end ? 1 : -1;
    const step = args.length === 4
        ? args[3] as number
        : defaultStep;
    if (!Number.isFinite(end)) {
        throw new TypeError(
            `expect a finite number as step (file ${fileName} line ${line})`
        );
    }
    if (start !== end && Math.sign(defaultStep) !== Math.sign(step)) {
        throw new RangeError(
            `invalid step (file ${fileName} line ${line})`
        );
    }

    return (rawBlock, ctx, fileName, line) => {
        const blocks = evalList(rawBlock, ctx, fileName);
        if (blocks.length !== 1 || typeof blocks[0] !== 'function') {
            throw new TypeError(
                `expect exactly one code block (file ${fileName} line ${line})`
            );
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
                    blocks[0]([], ctx, fileName, line);
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
    (rawBlock, ctx, fileName, line) => {
        const blocks = evalList(rawBlock, ctx, fileName);
        if (blocks.length !== 1 || typeof blocks[0] !== 'function') {
            throw new TypeError(
                `expect exactly one code block (file ${fileName} line ${line})`
            );
        }
        const oldBreak = ctx.get('break');
        const breakFlag = Symbol('breakFlag');
        const oldContinue = ctx.get('continue');
        const continueFlag = Symbol('continueFlag');
        ctx.set('break', () => { throw breakFlag; });
        ctx.set('continue', () => { throw continueFlag; });
        try {
            while (true) {
                const condition = evalAST(rawArgs, ctx, fileName);
                if (typeof condition !== 'boolean') {
                    throw new TypeError(
                        `expect a boolean as condition (file ${fileName} line ${line})`
                    );
                }
                if (!condition) {
                    break;
                }
                try {
                    blocks[0]([], ctx, fileName, line);
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
