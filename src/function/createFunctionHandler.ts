import { FunctionHandler, Utils } from '../common';
import { evalList } from "../eval/evalList";
import { FunctionCallback } from './common';

export const createFunctionHandler = (
    minArgCount: number,
    maxArgCount: number,
    callback: FunctionCallback,
): FunctionHandler => (
    (rawArgs, referrer, context, thisArg) => {
        const args = evalList(rawArgs, context);
        if (args.length < minArgCount) {
            Utils.raise(TypeError, 'too few arguments', referrer, context);
        } else if (args.length > maxArgCount) {
            Utils.raise(TypeError, 'too many arguments', referrer, context);
        }
        return callback(args, referrer, context, thisArg);
    }
);
