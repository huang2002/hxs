import { ContextValue, Dict, Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";
import { getConstructorOf, isInstanceOf, getKeysOf, getProperty, hasProperty, setProperty } from './common';

export const builtinDict = Utils.injectHelp(
    'A dict providing methods for dict manipulations.',
    Utils.createDict({

        __invoke: Utils.injectHelp(
            'Dict.__invoke(entries?)',
            createFunctionHandler(0, 1, (args, referrer, context) => {

                const dict = Object.create(null) as Dict;

                if (args.length === 0) {
                    return dict;
                }

                const entries = args[0] as [string, ContextValue][];
                if (!Array.isArray(entries)) {
                    Utils.raise(TypeError, `expect an array of arrays as entries`, referrer, context);
                }

                for (let i = 0; i < entries.length; i++) {

                    const entry = entries[i];

                    if (
                        !Array.isArray(entry)
                        || entry.length !== 2
                        || typeof entry[0] !== 'string'
                    ) {
                        Utils.raise(TypeError, `invalid dict entry`, referrer, context);
                    }

                    dict[entry[0]] = entry[1];

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

        has: Utils.injectHelp(
            'Dict.has(dict, key)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict to check`, referrer, context);
                }
                const key = args[1] as string;
                if (typeof key !== 'string') {
                    Utils.raise(TypeError, 'expect a string as key', referrer, context);
                }
                return (key in dict);
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
                    Utils.raise(TypeError, 'expect a string as key', referrer, context);
                }
                if (key in dict) { // Don't use `hasProperty` here!
                    delete dict[key];
                }
                return null;
            })
        ),

        get: Utils.injectHelp(
            'Dict.get(dict, key)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                const key = args[1] as string;
                if (typeof key !== 'string') {
                    Utils.raise(TypeError, 'expect a string as key', referrer, context);
                }
                if (key in dict) { // Don't use `hasProperty` here!
                    return dict[key];
                } else {
                    return null;
                }
            })
        ),

        set: Utils.injectHelp(
            'Dict.set(dict, key, value)',
            createFunctionHandler(3, 3, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                const key = args[1] as string;
                if (typeof key !== 'string') {
                    Utils.raise(TypeError, 'expect a string as key', referrer, context);
                }
                dict[key] = args[2];
                return null;
            })
        ),

        keys: Utils.injectHelp(
            'Dict.keys(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                return Object.keys(dict);
            })
        ),

        entries: Utils.injectHelp(
            'Dict.entries(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict`, referrer, context);
                }
                return Object.entries(dict);
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
                        if (hasProperty(dict, names[i], referrer, referrer, context)) {
                            store[names[i]] = getProperty(
                                dict,
                                names[i],
                                referrer,
                                referrer,
                                context,
                            );
                        } else {
                            store[names[i]] = null;
                        }
                    }
                } else {
                    for (let i = 0; i < names.length; i++) {
                        if (!hasProperty(dict, names[i], referrer, referrer, context)) {
                            Utils.raise(ReferenceError, `unknown key(${Utils.toDisplay(names[i])})`, referrer, context);
                        }
                    }
                    for (let i = 0; i < names.length; i++) {
                        store[names[i]] = getProperty(
                            dict,
                            names[i],
                            referrer,
                            referrer,
                            context,
                        );
                    }
                }
                return null;
            })
        ),

        assign: Utils.injectHelp(
            'Dict.assign(dict, props, allowOverwrite = true)',
            createFunctionHandler(2, 3, (args, referrer, context) => {

                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, `expect a dict to modify`, referrer, context);
                }

                const props = args[1] as Dict;
                if (!Utils.isDict(props)) {
                    Utils.raise(TypeError, `expect another dict as props`, referrer, context);
                }

                const allowOverwrite = args.length === 3 ? args[2] as boolean : true;
                if (typeof allowOverwrite !== 'boolean') {
                    Utils.raise(TypeError, `expect a boolean as overwrite option`, referrer, context);
                }

                getKeysOf(props, referrer, context).forEach(key => {
                    if (
                        !allowOverwrite
                        && hasProperty(dict, key, referrer, referrer, context)
                    ) {
                        return;
                    }
                    const value = getProperty(
                        props,
                        key,
                        referrer,
                        referrer,
                        context,
                    );
                    setProperty(
                        dict,
                        key,
                        value,
                        referrer,
                        referrer,
                        context,
                    );
                });

                return dict;

            })
        ),

        diff: Utils.injectHelp(
            'Dict.diff(target, reference)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const target = args[0] as Dict;
                const reference = args[1] as Dict;
                if (!Utils.isDict(target)) {
                    Utils.raise(TypeError, `expect a dict as target`, referrer, context);
                }
                if (!Utils.isDict(reference)) {
                    Utils.raise(TypeError, `expect a dict as reference`, referrer, context);
                }
                return Utils.diffDict(target, reference);
            })
        ),

        getConstructorOf: Utils.injectHelp(
            'Dict.getConstructorOf(dict)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, 'expect a dict', referrer, context);
                }
                return getConstructorOf(dict);
            })
        ),

        isInstanceOf: Utils.injectHelp(
            'Dict.isInstanceOf(dict, class)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const dict = args[0] as Dict;
                if (!Utils.isDict(dict)) {
                    Utils.raise(TypeError, 'expect a dict to check', referrer, context);
                }
                return isInstanceOf(args[1], dict);
            })
        ),

    })
);
