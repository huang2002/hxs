import { Utils } from '../common';
import { createFunctionHandler } from "../function/createFunctionHandler";

export const builtinMath = Utils.injectHelp(
    'A dict providing constants and methods for math calculation.',
    Utils.createDict({

        PI: Math.PI,
        E: Math.E,

        random: Utils.injectHelp(
            'random()',
            createFunctionHandler(0, 0, Math.random)
        ),

        sign: Utils.injectHelp(
            'sign(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.sign(args[0] as number);
            })
        ),

        floor: Utils.injectHelp(
            'floor(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.floor(args[0] as number);
            })
        ),

        ceil: Utils.injectHelp(
            'ceil(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.ceil(args[0] as number);
            })
        ),

        round: Utils.injectHelp(
            'round(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.round(args[0] as number);
            })
        ),

        sqrt: Utils.injectHelp(
            'sqrt(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const x = args[0] as number;
                if (typeof x !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                if (x < 0) {
                    Utils.raise(RangeError, `invalid radicant`, referrer, context);
                }
                return Math.sqrt(x);
            })
        ),

        min: Utils.injectHelp(
            'min(numbers)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const numbers = args[0] as number[];
                if (!Array.isArray(numbers)) {
                    Utils.raise(TypeError, `expect an array of numbers`, referrer, context);
                }
                let min = Infinity;
                for (let i = 0; i < numbers.length; i++) {
                    if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                        Utils.raise(TypeError, `invalid input`, referrer, context);
                    }
                    if (numbers[i] < min) {
                        min = numbers[i];
                    }
                }
                return min;
            })
        ),

        max: Utils.injectHelp(
            'max(numbers)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const numbers = args[0] as number[];
                if (!Array.isArray(numbers)) {
                    Utils.raise(TypeError, `expect an array of numbers`, referrer, context);
                }
                let max = -Infinity;
                for (let i = 0; i < numbers.length; i++) {
                    if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                        Utils.raise(TypeError, `invalid input`, referrer, context);
                    }
                    if (numbers[i] > max) {
                        max = numbers[i];
                    }
                }
                return max;
            })
        ),

        sum: Utils.injectHelp(
            'sum(numbers)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const numbers = args[0] as number[];
                if (!Array.isArray(numbers)) {
                    Utils.raise(TypeError, `expect an array of numbers`, referrer, context);
                }
                let sum = 0;
                for (let i = 0; i < numbers.length; i++) {
                    if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                        Utils.raise(TypeError, `invalid input`, referrer, context);
                    }
                    sum += numbers[i];
                }
                return sum;
            })
        ),

        mean: Utils.injectHelp(
            'mean(numbers)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const numbers = args[0] as number[];
                if (!Array.isArray(numbers)) {
                    Utils.raise(TypeError, `expect an array of numbers`, referrer, context);
                }
                if (!numbers.length) {
                    Utils.raise(RangeError, `no numbers given`, referrer, context);
                }
                let sum = 0;
                for (let i = 0; i < numbers.length; i++) {
                    if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                        Utils.raise(TypeError, `invalid input`, referrer, context);
                    }
                    sum += numbers[i];
                }
                return sum / numbers.length;
            })
        ),

        log: Utils.injectHelp(
            'log(a, b)',
            createFunctionHandler(2, 2, (args, referrer, context) => {
                const a = args[0] as number;
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as base`, referrer, context);
                }
                if (a <= 0 || a === 1 || a === Infinity) {
                    Utils.raise(RangeError, `invalid base`, referrer, context);
                }
                const b = args[1] as number;
                if (typeof b !== 'number') {
                    Utils.raise(TypeError, `expect a number as natural number`, referrer, context);
                }
                if (b <= 0) {
                    Utils.raise(RangeError, `invalid natural number`, referrer, context);
                }
                return Math.log(b) / Math.log(a);
            })
        ),

        ln: Utils.injectHelp(
            'ln(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const x = args[0] as number;
                if (typeof x !== 'number') {
                    Utils.raise(TypeError, `expect a number as natural number`, referrer, context);
                }
                if (x <= 0) {
                    Utils.raise(RangeError, `invalid natural number`, referrer, context);
                }
                return Math.log(x);
            })
        ),

        lg: Utils.injectHelp(
            'lg(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                const x = args[0] as number;
                if (typeof x !== 'number') {
                    Utils.raise(TypeError, `expect a number as natural number`, referrer, context);
                }
                if (x <= 0) {
                    Utils.raise(RangeError, `invalid natural number`, referrer, context);
                }
                return Math.log(x) / Math.LN10;
            })
        ),

        sin: Utils.injectHelp(
            'sin(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.sin(args[0] as number);
            })
        ),

        cos: Utils.injectHelp(
            'cos(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.cos(args[0] as number);
            })
        ),

        tan: Utils.injectHelp(
            'tan(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.tan(args[0] as number);
            })
        ),

        csc: Utils.injectHelp(
            'csc(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return 1 / Math.sin(args[0] as number);
            })
        ),

        sec: Utils.injectHelp(
            'sec(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return 1 / Math.cos(args[0] as number);
            })
        ),

        cot: Utils.injectHelp(
            'cot(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return 1 / Math.tan(args[0] as number);
            })
        ),

        asin: Utils.injectHelp(
            'asin(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.asin(args[0] as number);
            })
        ),

        acos: Utils.injectHelp(
            'acos(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.acos(args[0] as number);
            })
        ),

        atan: Utils.injectHelp(
            'atan(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.atan(args[0] as number);
            })
        ),

        acsc: Utils.injectHelp(
            'acsc(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.asin(1 / (args[0] as number));
            })
        ),

        asec: Utils.injectHelp(
            'asec(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.acos(1 / (args[0] as number));
            })
        ),

        acot: Utils.injectHelp(
            'acot(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.atan(1 / (args[0] as number));
            })
        ),

        sinh: Utils.injectHelp(
            'sinh(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.sinh(args[0] as number);
            })
        ),

        cosh: Utils.injectHelp(
            'cosh(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.cosh(args[0] as number);
            })
        ),

        tanh: Utils.injectHelp(
            'tanh(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.tanh(args[0] as number);
            })
        ),

        csch: Utils.injectHelp(
            'csch(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return 1 / Math.sinh(args[0] as number);
            })
        ),

        sech: Utils.injectHelp(
            'sech(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return 1 / Math.cosh(args[0] as number);
            })
        ),

        coth: Utils.injectHelp(
            'coth(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return 1 / Math.tanh(args[0] as number);
            })
        ),

        asinh: Utils.injectHelp(
            'asinh(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.asinh(args[0] as number);
            })
        ),

        acosh: Utils.injectHelp(
            'acosh(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.acosh(args[0] as number);
            })
        ),

        atanh: Utils.injectHelp(
            'atanh(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.atanh(args[0] as number);
            })
        ),

        acsch: Utils.injectHelp(
            'acsch(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.asinh(1 / (args[0] as number));
            })
        ),

        asech: Utils.injectHelp(
            'asech(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.acosh(1 / (args[0] as number));
            })
        ),

        acoth: Utils.injectHelp(
            'acoth(x)',
            createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'number') {
                    Utils.raise(TypeError, `expect a number as argument`, referrer, context);
                }
                return Math.atanh(1 / (args[0] as number));
            })
        ),

    })
);
