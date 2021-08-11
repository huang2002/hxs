import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinNumber = Utils.injectHelp(
    'A dict providing methods for number manipulations.',
    Utils.createDict({

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

        isNaN: Utils.injectHelp(
            'Number.isNaN(number)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const number = args[0] as number;
                if (typeof number !== 'number') {
                    Utils.raise(TypeError, 'expect a number', referrer, context);
                }
                return Number.isNaN(number);
            })
        ),

        parseInt: Utils.injectHelp(
            'Number.parseInt(string, radix = 10)',
            createFunctionHandler(1, 2, (args, referrer, context) => {
                const string = args[0] as string;
                if (typeof string !== 'string') {
                    Utils.raise(TypeError, 'expect a string to convert', referrer, context);
                }
                const radix = args.length > 1 ? args[1] as number : 10;
                if (typeof radix !== 'number') {
                    Utils.raise(TypeError, 'expect a number as radix', referrer, context);
                }
                if (!(radix >= 2 && radix <= 36)) {
                    Utils.raise(RangeError, 'radix must be between 2 and 36', referrer, context);
                }
                const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
                let result = 0;
                for (let i = 0; i < string.length; i++) {
                    const x = DIGITS.indexOf(string[string.length - i - 1]);
                    if (x === -1 || x >= radix) {
                        return NaN;
                    }
                    result += x * (radix ** i);
                }
                return result;
            })
        ),

    })
);
