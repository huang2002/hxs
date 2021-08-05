import { ContextValue, Dict, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinDict = Utils.injectHelp(
    'A dict providing methods for dict manipulations.',
    Utils.createDict({

        create: Utils.injectHelp(
            'Dict.create()',
            createFunctionHandler(0, 0, (args, referrer, context) => {
                return Object.create(null);
            })
        ),

        from: Utils.injectHelp(
            'Dict.from(entries)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const entries = args[0];
                if (!Array.isArray(entries)) {
                    Utils.raise(TypeError, `expect an array of arrays as entries`, referrer, context);
                }
                const dict = Object.create(null);
                for (let i = 0; i < (entries as unknown[]).length; i++) {
                    const entry = (entries as unknown[])[i];
                    if (
                        !Array.isArray(entry)
                        || entry.length !== 2
                        || typeof entry[0] !== 'string'
                    ) {
                        Utils.raise(TypeError, `invalid dict entry`, referrer, context);
                    }
                    type DictEntry = [string, ContextValue];
                    dict[(entry as DictEntry)[0]] = (entry as DictEntry)[1];
                }
                return dict;
            })
        ),

        clone: Utils.injectHelp(
            'Dict.clone(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0];
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict to clone`, referrer, context);
                }
                return Utils.createDict(dict as Dict);
            })
        ),

        keys: Utils.injectHelp(
            'Dict.keys(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0];
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                return Object.keys(dict as Dict);
            })
        ),

        entries: Utils.injectHelp(
            'Dict.entries(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0];
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                return Object.entries(dict as Dict);
            })
        ),

        has: Utils.injectHelp(
            'Dict.has(dict, key)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const dict = args[0];
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict to check`, referrer, context);
                }
                const key = args[1];
                if (typeof key !== 'string') {
                    Utils.raise(TypeError, `expect a string as key`, referrer, context);
                }
                return (key as string) in (dict as Dict);
            })
        ),

        set: Utils.injectHelp(
            'Dict.set(dict, key, value)',
            createFunctionHandler(3, 3, (args, referrer, context) => {
                const dict = args[0];
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                const key = args[1];
                if (typeof key !== 'string') {
                    Utils.raise(TypeError, `expect a string as key`, referrer, context);
                }
                (dict as Dict)[key as string] = args[2];
                return null;
            })
        ),

        unpack: Utils.injectHelp(
            'Dict.unpack(dict, names, loose = false)',
            createFunctionHandler(2, 3, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict to unpack`, referrer, context);
                }
                const names = args[1] as string[];
                if (!Array.isArray(names)) {
                    Utils.raise(TypeError, `expect an array of strings as variable names`, referrer, context);
                }
                for (let i = 0; i < names.length; i++) {
                    if (typeof names[i] !== 'string') {
                        Utils.raise(TypeError, `expect strings as variable names`, referrer, context);
                    }
                }
                const loose = args.length === 3 && args[2];
                if (typeof loose !== 'boolean') {
                    Utils.raise(TypeError, `expect a boolean as loose option`, referrer, context);
                }
                const { store } = context;
                if (loose) {
                    for (let i = 0; i < names.length; i++) {
                        store.set(
                            names[i],
                            names[i] in dict
                                ? dict[names[i]]
                                : null
                        );
                    }
                } else {
                    for (let i = 0; i < names.length; i++) {
                        if (!(names[i] in dict)) {
                            Utils.raise(ReferenceError, `unknown key("${names[i]}")`, referrer, context);
                        }
                    }
                    for (let i = 0; i < names.length; i++) {
                        store.set(names[i], dict[names[i]]);
                    }
                }
                return null;
            })
        ),

        remove: Utils.injectHelp(
            'Dict.remove(dict, key)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                const key = args[1] as string;
                if (typeof key !== 'string') {
                    Utils.raise(TypeError, `expect a string as key`, referrer, context);
                }
                delete dict[key];
                return null;
            })
        ),

    })
);
