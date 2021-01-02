import { Common } from '../common';
import { evalList } from '../eval';
import { RuleHandler } from '../rules/rule';

export const buildIf = (lastCondition: boolean): RuleHandler => (
    (rawArgs, context, fileName, line): RuleHandler => {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'if', 1, 1);
        if (typeof args[0] !== 'boolean') {
            throw new TypeError(
                `expect a boolean as condition (file ${fileName} line ${line})`
            );
        }
        const condition = args[0];
        return (rawBlock, ctx, _fileName, line) => {
            const blocks = evalList(rawBlock, ctx, _fileName);
            if (blocks.length !== 1 || typeof blocks[0] !== 'function') {
                throw new TypeError(
                    `expect exactly one code block (file ${_fileName} line ${line})`
                );
            }
            if (!lastCondition && condition) {
                blocks[0]([], ctx, fileName, line);
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
