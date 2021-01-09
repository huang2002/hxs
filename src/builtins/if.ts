import { Common } from '../common';
import { evalList } from '../eval';
import { RuleHandler } from '../rules/rule';

export const buildIf = (lastCondition: boolean): RuleHandler => (
    (rawArgs, context, env): RuleHandler => {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'if', 1, 1);
        const condition = args[0] as boolean;
        if (typeof condition !== 'boolean') {
            Common.raise(TypeError, `expect a boolean as condition`, env);
        }
        return (rawBlock, ctx, _env) => {
            const blocks = evalList(rawBlock, ctx, _env.fileName) as [RuleHandler];
            if (blocks.length !== 1 || typeof blocks[0] !== 'function') {
                Common.raise(TypeError, `expect exactly one code block`, _env);
            }
            if (!lastCondition && condition) {
                blocks[0]([], ctx, env);
            }
            return buildIf(condition);
        };
    }
);

// if (condition) {
//     ...
// } (elseCondition) {
//     ...
// }
// ...
export const builtinIf: RuleHandler = buildIf(false);
