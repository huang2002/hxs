import { Utils } from '../common';
import { createFunctionHandler } from '../function/createFunctionHandler';

export const builtinJSON = Utils.injectHelp(
    'A dict providing methods for JSON operations.',
    Utils.createDict({

        parse: Utils.injectHelp(
            `JSON.parse(string)`,
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const string = args[0] as string;
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, `expect a string to parse`, referrer, context);
                }
                return JSON.parse(string);
            })
        ),

        stringify: Utils.injectHelp(
            `JSON.stringify(value, space = '')`,
            createFunctionHandler(1, 2, (args, referrer, context) => {
                const space = (args.length > 1) ? (args[1] as string) : '';
                if (typeof space !== 'string') {
                    Utils.raise(TypeError, `expect a string as space argument`, referrer, context);
                }
                return JSON.stringify(args[0], undefined, space);
            })
        ),

    })
);
