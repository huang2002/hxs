import { Common } from '../common';
import { evalList } from '../eval';
import { libs } from '../libs/libs';
import { RuleHandler } from '../rules/rule';

// import(name)
export const builtinImport: RuleHandler = (rawArgs, context, env) => {
    const args = evalList(rawArgs, context, env.fileName);
    Common.checkArgs(args, env, 'import', 1, 1);
    if (typeof args[0] !== 'string') {
        Common.raise(TypeError, `expect a string as lib name`, env);
    }
    const lib = libs.get(args[0] as string);
    if (!lib) {
        Common.raise(ReferenceError, `lib "${args[0]}" does not exist`, env);
    }
    return lib;
};
