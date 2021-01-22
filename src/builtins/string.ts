import { Common } from '../common';
import { evalList } from '../eval';

export const BuiltinString = Common.createDict({

    join: Common.injectHelp(
        `String.join(strings, separator='')`,
        (rawArgs, context, env) => {
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
        }
    ),

    toLowerCase: Common.injectHelp(
        `String.toLowerCase(string)`,
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'String.toLowerCase', 1, 1);
            if (typeof args[0] !== 'string') {
                Common.raise(TypeError, `expect a string as the first argument`, env);
            }
            return (args[0] as string).toLowerCase();
        }
    ),

    toUpperCase: Common.injectHelp(
        `String.toUpperCase(string)`,
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'String.toUpperCase', 1, 1);
            if (typeof args[0] !== 'string') {
                Common.raise(TypeError, `expect a string as the first argument`, env);
            }
            return (args[0] as string).toUpperCase();
        }
    ),

    slice: Common.injectHelp(
        `String.slice(string, start?, end?)`,
        (rawArgs, context, env) => {
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
        }
    ),

    indexOf: Common.injectHelp(
        `String.indexOf(string, substring)`,
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'String.indexOf', 2, 2);
            const string = args[0] as unknown[];
            if (typeof string !== 'string') {
                Common.raise(TypeError, `expect a string as the first argument`, env);
            }
            const substring = args[1] as unknown[];
            if (typeof substring !== 'string') {
                Common.raise(TypeError, `expect another string as the second argument`, env);
            }
            return string.indexOf(substring);
        }
    ),

    lastIndexOf: Common.injectHelp(
        `String.lastIndexOf(string, substring)`,
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'String.lastIndexOf', 2, 2);
            const string = args[0] as unknown[];
            if (typeof string !== 'string') {
                Common.raise(TypeError, `expect a string as the first argument`, env);
            }
            const substring = args[1] as unknown[];
            if (typeof substring !== 'string') {
                Common.raise(TypeError, `expect another string as the second argument`, env);
            }
            return string.lastIndexOf(substring);
        }
    ),

    includes: Common.injectHelp(
        `String.includes(string, substring)`,
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'String.includes', 2, 2);
            const string = args[0] as unknown[];
            if (typeof string !== 'string') {
                Common.raise(TypeError, `expect a string as the first argument`, env);
            }
            const substring = args[1] as unknown[];
            if (typeof substring !== 'string') {
                Common.raise(TypeError, `expect another string as the second argument`, env);
            }
            return string.includes(substring);
        }
    ),

});
