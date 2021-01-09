import { Common, Dict } from '../common';
import { evalList } from '../eval';

export const BuiltinDict = Common.createDict({

    // Dict.create()
    create(rawArgs, context, env) {
        if (rawArgs.length) {
            Common.raise(TypeError, `expect no arguments`, env);
        }
        return Object.create(null);
    },

    // Dict.from(entries?)
    from(rawArgs, context, env) {
        const dict = Object.create(null);
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Dict.from', 0, 1);
        if (args.length) {
            const entries = args[0] as unknown[];
            if (!Array.isArray(entries)) {
                Common.raise(TypeError, `invalid dict entries`, env);
            }
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (
                    !Array.isArray(entry)
                    || entry.length !== 2
                    || typeof entry[0] !== 'string'
                ) {
                    Common.raise(TypeError, `invalid dict entry`, env);
                }
                dict[entry[0]] = entry[1];
            }
        }
        return dict;
    },

    // Dict.clone(dict)
    clone(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Dict.clone', 1, 1);
        const dict = args[0] as Dict;
        if (!Common.isDict(dict)) {
            Common.raise(TypeError, `expect a dict as the first argument`, env);
        }
        return Common.createDict(dict);
    },

    // Dict.set(dict, key, value)
    set(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Dict.set', 2, 3);
        const dict = args[0] as Dict;
        if (!Common.isDict(dict)) {
            Common.raise(TypeError, `expect a dict as the first argument`, env);
        }
        if (typeof args[1] !== 'string') {
            Common.raise(TypeError, `expect a string as index`, env);
        }
        dict[args[1] as string] = args[2];
    },

    // Dict.unpack(dict, names, loose?)
    unpack(rawArgs, context, env) {
        const args = evalList(rawArgs, context, env.fileName);
        Common.checkArgs(args, env, 'Dict.unpack', 2, 3);
        const dict = args[0] as Dict;
        if (!Common.isDict(dict)) {
            Common.raise(TypeError, `expect a dict as the first argument`, env);
        }
        const names = args[1] as readonly string[];
        if (!Array.isArray(names)) {
            Common.raise(TypeError, `expect an dict of strings as variable names`, env);
        }
        for (let i = 0; i < names.length; i++) {
            if (typeof names[i] !== 'string') {
                Common.raise(TypeError, `expect strings as variable names`, env);
            }
        }
        const loose = args.length === 3 && args[2];
        if (typeof loose !== 'boolean') {
            Common.raise(TypeError, `expect a boolean as loose option`, env);
        }
        if (loose) {
            for (let i = 0; i < names.length; i++) {
                context.set(
                    names[i],
                    names[i] in dict
                        ? dict[names[i]]
                        : null
                );
            }
        } else {
            for (let i = 0; i < names.length; i++) {
                if (!(names[i] in dict)) {
                    Common.raise(ReferenceError, `unknown index "${names[i]}"`, env);
                }
            }
            for (let i = 0; i < names.length; i++) {
                context.set(names[i], dict[names[i]]);
            }
        }
    },

});
