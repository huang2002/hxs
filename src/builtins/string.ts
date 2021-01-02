import { Common } from '../common';
import { evalList } from '../eval';

export const BuiltinString = Common.createDict({

    // String.join(strings, separator='')
    join(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'String.join', 1, 2);
        const strings = args[0];
        if (!Array.isArray(strings)) {
            throw new TypeError(
                `expect a string array as the first argument (file ${fileName} line ${line})`
            );
        }
        for (let i = 0; i < strings.length; i++) {
            if (typeof strings[i] !== 'string') {
                throw new TypeError(
                    `expect only strings (file ${fileName} line ${line})`
                );
            }
        }
        const separator = args.length === 2 ? args[1] : '';
        if (typeof separator !== 'string') {
            throw new TypeError(
                `expect a string as separator (file ${fileName} line ${line})`
            );
        }
        return strings.join(separator);
    },

    // String.toLowerCase(string)
    toLowerCase(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'String.toLowerCase', 1, 1);
        if (typeof args[0] !== 'string') {
            throw new TypeError(
                `expect a string as the first argument (file ${fileName} line ${line})`
            );
        }
        return args[0].toLowerCase();
    },

    // String.toUpperCase(string)
    toUpperCase(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'String.toUpperCase', 1, 1);
        if (typeof args[0] !== 'string') {
            throw new TypeError(
                `expect a string as the first argument (file ${fileName} line ${line})`
            );
        }
        return args[0].toUpperCase();
    },

    // String.slice(string, start?, end?)
    slice(rawArgs, context, fileName, line) {
        const args = evalList(rawArgs, context, fileName);
        Common.checkArgs(args, fileName, line, 'String.slice', 1, 3);
        const string = args[0];
        if (typeof string !== 'string') {
            throw new TypeError(
                `expect a string as the first argument (file ${fileName} line ${line})`
            );
        }
        if (args.length > 1) {
            if (typeof args[1] !== 'number') {
                throw new TypeError(
                    `expect a number as start index (file ${fileName} line ${line})`
                );
            }
            if (args.length > 2) {
                if (typeof args[2] !== 'number') {
                    throw new TypeError(
                        `expect a number as end index (file ${fileName} line ${line})`
                    );
                }
            }
        }
        return string.slice(
            args[1] as number | undefined,
            args[2] as number | undefined
        );
    },

});
