import { Common } from '../common';
import { evalList } from '../eval';

export const BuiltinString = Common.createDict({

    // String.join(strings, separator='')
    join(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'String.join', 1, 2);
        const strings = args[0] as string[];
        if (!Array.isArray(strings)) {
            Common.raise(TypeError, `expect a string array as the first argument`, env);
        }
        for (let i = 0; i < strings.length; i++) {
            if (typeof strings[i] !== 'string') {
                Common.raise(TypeError, `expect only strings`, env);
            }
        }
        const separator = args.length === 2 ? args[1] as string : '';
        if (typeof separator !== 'string') {
            Common.raise(TypeError, `expect a string as separator`, env);
        }
        return strings.join(separator);
    },

    // String.toLowerCase(string)
    toLowerCase(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'String.toLowerCase', 1, 1);
        if (typeof args[0] !== 'string') {
            Common.raise(TypeError, `expect a string as the first argument`, env);
        }
        return (args[0] as string).toLowerCase();
    },

    // String.toUpperCase(string)
    toUpperCase(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'String.toUpperCase', 1, 1);
        if (typeof args[0] !== 'string') {
            Common.raise(TypeError, `expect a string as the first argument`, env);
        }
        return (args[0] as string).toUpperCase();
    },

    // String.slice(string, start?, end?)
    slice(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'String.slice', 1, 3);
        const string = args[0] as string;
        if (typeof string !== 'string') {
            Common.raise(TypeError, `expect a string as the first argument`, env);
        }
        if (args.length > 1) {
            if (typeof args[1] !== 'number') {
                Common.raise(TypeError, `expect a number as start index`, env);
            }
            if (args.length > 2) {
                if (typeof args[2] !== 'number') {
                    Common.raise(TypeError, `expect a number as end index`, env);
                }
            }
        }
        return string.slice(
            args[1] as number | undefined,
            args[2] as number | undefined
        );
    },

    // String.indexOf(string, substring)
    indexOf(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'String.indexOf', 2, 2);
        const string = args[0] as unknown[];
        if (typeof string !== 'string') {
            Common.raise(TypeError, `expect a string as the first argument`, env);
        }
        return string.indexOf(args[1]);
    },

    // String.lastIndexOf(string, substring)
    lastIndexOf(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'String.lastIndexOf', 2, 2);
        const string = args[0] as unknown[];
        if (typeof string !== 'string') {
            Common.raise(TypeError, `expect a string as the first argument`, env);
        }
        return string.lastIndexOf(args[1]);
    },

});
