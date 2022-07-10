import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinString = Utils.injectHelp(
    'A dict providing methods for string manipulations.',
    Utils.createDict({

        __invoke: Utils.injectHelp(
            `String.__invoke(parts...)`,
            createFunctionHandler(1, Infinity, (args, referrer, context) => {
                let result = '';
                for (let i = 0; i < args.length; i++) {
                    result += Utils.toString(args[i]);
                }
                return result;
            })
        ),

        sizeOf: Utils.injectHelp(
            'String.sizeOf(string)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, 'expect a string', referrer, context);
                }
                return (string as string).length;
            })
        ),

        toLowerCase: Utils.injectHelp(
            `String.toLowerCase(string)`,
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'string') {
                    Utils.raise(TypeError, `expect a string`, referrer, context);
                }
                return (args[0] as string).toLowerCase();
            })
        ),

        toUpperCase: Utils.injectHelp(
            `String.toUpperCase(string)`,
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'string') {
                    Utils.raise(TypeError, `expect a string`, referrer, context);
                }
                return (args[0] as string).toUpperCase();
            })
        ),

        slice: Utils.injectHelp(
            `String.slice(string, start = 0, end = String.sizeOf(string))`,
            createFunctionHandler(1, 3, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string as source`, referrer, context);
                }
                if (args.length > 1) {
                    if (typeof args[1] !== 'number') {
                        Utils.raise(TypeError, `expect a number as begin index`, referrer, context);
                    }
                    if (args.length > 2) {
                        if (typeof args[2] !== 'number') {
                            Utils.raise(TypeError, `expect a number as end index`, referrer, context);
                        }
                    }
                }
                return (string as string).slice(
                    args[1] as number | undefined,
                    args[2] as number | undefined,
                );
            })
        ),

        indexOf: Utils.injectHelp(
            `String.indexOf(string, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (string as string).indexOf(substring as string);
            })
        ),

        lastIndexOf: Utils.injectHelp(
            `String.lastIndexOf(string, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (string as string).lastIndexOf(substring as string);
            })
        ),

        includes: Utils.injectHelp(
            `String.includes(string, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (string as string).includes(substring as string);
            })
        ),

        repeat: Utils.injectHelp(
            `String.repeat(string, count)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0] as string;
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to repeat`, referrer, context);
                }
                const count = args[1] as number;
                if (typeof count !== 'number') {
                    Utils.raise(TypeError, `expect a number as repeating count`, referrer, context);
                }
                if (!Number.isFinite(count) || count < 0) {
                    Utils.raise(RangeError, `invalid count`, referrer, context);
                }
                return string.repeat(count);
            })
        ),

        codePointAt: Utils.injectHelp(
            `String.codePointAt(string, index)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0] as string;
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string`, referrer, context);
                }
                const index = args[1] as number;
                if (typeof index !== 'number') {
                    Utils.raise(TypeError, `expect a number as index`, referrer, context);
                }
                const normalizedIndex = Utils.normalizeIndex(
                    index,
                    string.length,
                    referrer,
                    context,
                );
                const result = string.codePointAt(normalizedIndex);
                if (typeof result === 'number') {
                    return result;
                } else {
                    return null;
                }
            })
        ),

        startsWith: Utils.injectHelp(
            `String.startsWith(string, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (string as string).startsWith(substring as string);
            })
        ),

        endsWith: Utils.injectHelp(
            `String.endsWith(string, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const string = args[0];
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (string as string).endsWith(substring as string);
            })
        ),

    })
);
