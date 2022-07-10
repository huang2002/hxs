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
            'String.sizeOf(str)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, 'expect a string', referrer, context);
                }
                return (str as string).length;
            })
        ),

        toLowerCase: Utils.injectHelp(
            `String.toLowerCase(str)`,
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'string') {
                    Utils.raise(TypeError, `expect a string`, referrer, context);
                }
                return (args[0] as string).toLowerCase();
            })
        ),

        toUpperCase: Utils.injectHelp(
            `String.toUpperCase(str)`,
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'string') {
                    Utils.raise(TypeError, `expect a string`, referrer, context);
                }
                return (args[0] as string).toUpperCase();
            })
        ),

        slice: Utils.injectHelp(
            `String.slice(str, start = 0, end = String.sizeOf(str))`,
            createFunctionHandler(1, 3, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
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
                return (str as string).slice(
                    args[1] as number | undefined,
                    args[2] as number | undefined,
                );
            })
        ),

        indexOf: Utils.injectHelp(
            `String.indexOf(str, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (str as string).indexOf(substring as string);
            })
        ),

        lastIndexOf: Utils.injectHelp(
            `String.lastIndexOf(str, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (str as string).lastIndexOf(substring as string);
            })
        ),

        includes: Utils.injectHelp(
            `String.includes(str, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (str as string).includes(substring as string);
            })
        ),

        repeat: Utils.injectHelp(
            `String.repeat(str, count)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0] as string;
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string to repeat`, referrer, context);
                }
                const count = args[1] as number;
                if (typeof count !== 'number') {
                    Utils.raise(TypeError, `expect a number as repeating count`, referrer, context);
                }
                if (!Number.isFinite(count) || count < 0) {
                    Utils.raise(RangeError, `invalid count`, referrer, context);
                }
                return str.repeat(count);
            })
        ),

        codePointAt: Utils.injectHelp(
            `String.codePointAt(str, index)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0] as string;
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string`, referrer, context);
                }
                const index = args[1] as number;
                if (typeof index !== 'number') {
                    Utils.raise(TypeError, `expect a number as index`, referrer, context);
                }
                const normalizedIndex = Utils.normalizeIndex(
                    index,
                    str.length,
                    referrer,
                    context,
                );
                const result = str.codePointAt(normalizedIndex);
                if (typeof result === 'number') {
                    return result;
                } else {
                    return null;
                }
            })
        ),

        startsWith: Utils.injectHelp(
            `String.startsWith(str, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (str as string).startsWith(substring as string);
            })
        ),

        endsWith: Utils.injectHelp(
            `String.endsWith(str, substring)`,
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const str = args[0];
                if (typeof str !== 'string') {
                    Utils.raise(TypeError, `expect a string to search in`, referrer, context);
                }
                const substring = args[1];
                if (typeof substring !== 'string') {
                    Utils.raise(TypeError, `expect another string to search for`, referrer, context);
                }
                return (str as string).endsWith(substring as string);
            })
        ),

    })
);
