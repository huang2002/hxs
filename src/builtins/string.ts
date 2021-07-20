import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinString = Utils.createDict({

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

    join: Utils.injectHelp(
        `String.join(parts...)`,
        createFunctionHandler(1, Infinity, (args, referrer, context) => {
            let result = '';
            for (let i = 0; i < args.length; i++) {
                result += Utils.toString(args[i]);
            }
            return result;
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

});
