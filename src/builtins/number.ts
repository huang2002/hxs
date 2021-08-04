import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinNumber = Utils.createDict({

    toString: Utils.injectHelp(
        'Number.toString(number, radix = 10)',
        createFunctionHandler(1, 2, (args, referrer, context) => {
            const number = args[0] as number;
            if (typeof number !== 'number') {
                Utils.raise(TypeError, 'expect a number to convert', referrer, context);
            }
            if (args.length === 1) {
                return number.toString();
            }
            const radix = args[1] as number;
            if (typeof radix !== 'number') {
                Utils.raise(TypeError, 'expect a number as radix', referrer, context);
            }
            if (!(radix >= 2 && radix <= 36)) {
                Utils.raise(RangeError, 'radix must be between 2 and 36', referrer, context);
            }
            return number.toString(radix);
        })
    ),

    isFinite: Utils.injectHelp(
        'Number.isFinite(number)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
            const number = args[0] as number;
            if (typeof number !== 'number') {
                Utils.raise(TypeError, 'expect a number', referrer, context);
            }
            return Number.isFinite(number);
        })
    ),

    isInteger: Utils.injectHelp(
        'Number.isInteger(number)',
        createFunctionHandler(1, 1, (args, referrer, context) => {
            const number = args[0] as number;
            if (typeof number !== 'number') {
                Utils.raise(TypeError, 'expect a number', referrer, context);
            }
            return Number.isInteger(number);
        })
    ),

});
