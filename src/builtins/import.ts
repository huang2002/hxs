import { Common } from '../common';
import { evalList } from '../eval';
import { libs } from '../libs/libs';
import { RuleHandler } from '../rules/rule';

// import(name)
export const builtinImport: RuleHandler = (rawArgs, context, fileName) => {
    const args = evalList(rawArgs, context, fileName);
    const line = rawArgs[0].line;
    Common.checkArgs(args, fileName, line, 'import', 1, 1);
    if (typeof args[0] !== 'string') {
        throw new TypeError(
            `expect a string as lib name (file ${fileName} line ${line})`
        );
    }
    const lib = libs.get(args[0]);
    if (!lib) {
        throw new ReferenceError(
            `lib "${args[0]}" does not exist (file ${fileName} line ${line})`
        );
    }
    return lib;
};
