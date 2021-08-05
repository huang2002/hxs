import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const print = Utils.injectHelp(
    'print(message...)',
    createFunctionHandler(0, Infinity, (args, referrer, context) => {
        let message = '';
        for (let i = 0; i < args.length; i++) {
            message += Utils.toString(args[i]);
        }
        console.log(message);
        return null;
    })
);
