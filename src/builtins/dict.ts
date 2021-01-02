import { Common } from '../common';
import { evalList } from '../eval';

export const BuiltinDict = Common.createDict({

    // Dict.create()
    create(rawArgs, context, fileName) {
        if (rawArgs.length) {
            throw new TypeError(
                `expect no arguments (file ${fileName} line ${rawArgs[0].line})`
            );
        }
        return Object.create(null);
    },

    // Dict.from(entries?)
    from(rawArgs, context, fileName, line) {
        const dict = Object.create(null);
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Dict.from', 0, 1);
        if (args.length) {
            const entries = args[0];
            if (!Array.isArray(entries)) {
                throw new TypeError(
                    `invalid dict entries (file ${fileName} line ${line})`
                );
            }
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (
                    !Array.isArray(entry)
                    || entry.length !== 2
                    || typeof entry[0] !== 'string'
                ) {
                    throw new TypeError(
                        `invalid dict entry (file ${fileName} line ${line})`
                    );
                }
                dict[entry[0]] = entry[1];
            }
        }
        return dict;
    },

    // Dict.clone(dict)
    clone(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Dict.clone', 1, 1);
        const dict = args[0];
        if (!Common.isDict(dict)) {
            throw new TypeError(
                `expect a dict as the first argument (file ${fileName} line ${line})`
            );
        }
        return Common.createDict(dict);
    },

    // Dict.set(dict, key, value)
    set(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Dict.set', 2, 3);
        const dict = args[0];
        if (!Common.isDict(dict)) {
            throw new TypeError(
                `expect a dict as the first argument (file ${fileName} line ${line})`
            );
        }
        if (typeof args[1] !== 'string') {
            throw new TypeError(
                `expect a string as index (file ${fileName} line ${line})`
            );
        }
        dict[args[1]] = args[2];
    },

    // Dict.unpack(dict, names, loose?)
    unpack(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'Dict.unpack', 2, 3);
        const dict = args[0];
        if (!Common.isDict(dict)) {
            throw new TypeError(
                `expect a dict as the first argument (file ${fileName} line ${line})`
            );
        }
        const names = args[1] as readonly string[];
        if (!Array.isArray(names)) {
            throw new TypeError(
                `expect an dict of strings as variable names (file ${fileName} line ${line})`
            );
        }
        for (let i = 0; i < names.length; i++) {
            if (typeof names[i] !== 'string') {
                throw new TypeError(
                    `expect strings as variable names (file ${fileName} line ${line})`
                );
            }
        }
        const loose = args.length === 3 && args[2];
        if (typeof loose !== 'boolean') {
            throw new TypeError(
                `expect a boolean as loose option (file ${fileName} line ${line})`
            );
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
                    throw new ReferenceError(
                        `unknown index "${names[i]}" (file ${fileName} line ${line})`
                    );
                }
            }
            for (let i = 0; i < names.length; i++) {
                context.set(names[i], dict[names[i]]);
            }
        }
    },

});
