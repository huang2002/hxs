import { Common } from '../common';
import { evalList } from '../eval';

export const math = Common.createDict({

    PI: Math.PI,
    E: Math.E,

    random: Common.injectHelp(
        'random()',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'math.random', 0, 0);
            return Math.random();
        }
    ),

    sign: Common.injectHelp(
        'sign(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.sign', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.sign(args[0]);
        }
    ),

    floor: Common.injectHelp(
        'floor(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.floor', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.floor(args[0]);
        }
    ),

    ceil: Common.injectHelp(
        'ceil(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.ceil', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.ceil(args[0]);
        }
    ),

    round: Common.injectHelp(
        'round(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.round', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.round(args[0]);
        }
    ),

    sqrt: Common.injectHelp(
        'sqrt(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.sqrt', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            if (args[0] < 0) {
                Common.raise(RangeError, `invalid radicant`, env);
            }
            return Math.sqrt(args[0]);
        }
    ),

    min: Common.injectHelp(
        'min(numbers)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'math.min', 1, 1);
            const numbers = args[0] as number[];
            if (!Array.isArray(numbers)) {
                Common.raise(TypeError, `expect an array of numbers`, env);
            }
            let min = Infinity;
            for (let i = 0; i < numbers.length; i++) {
                if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                    Common.raise(TypeError, `expect only finite numbers and infinities`, env);
                }
                if (numbers[i] < min) {
                    min = numbers[i];
                }
            }
            return min;
        }
    ),

    max: Common.injectHelp(
        'max(numbers)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'math.max', 1, 1);
            const numbers = args[0] as number[];
            if (!Array.isArray(numbers)) {
                Common.raise(TypeError, `expect an array of numbers`, env);
            }
            let max = -Infinity;
            for (let i = 0; i < numbers.length; i++) {
                if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                    Common.raise(TypeError, `expect only finite numbers and infinities`, env);
                }
                if (numbers[i] > max) {
                    max = numbers[i];
                }
            }
            return max;
        }
    ),

    sum: Common.injectHelp(
        'sum(numbers)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'math.sum', 1, 1);
            const numbers = args[0] as number[];
            if (!Array.isArray(numbers)) {
                Common.raise(TypeError, `expect an array of numbers`, env);
            }
            let sum = 0;
            for (let i = 0; i < numbers.length; i++) {
                if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                    Common.raise(TypeError, `expect only finite numbers and infinities`, env);
                }
                sum += numbers[i];
            }
            return sum;
        }
    ),

    mean: Common.injectHelp(
        'mean(numbers)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName);
            Common.checkArgs(args, env, 'math.mean', 1, 1);
            const numbers = args[0] as number[];
            if (!Array.isArray(numbers)) {
                Common.raise(TypeError, `expect an array of numbers`, env);
            }
            if (!numbers.length) {
                Common.raise(RangeError, `no numbers given`, env);
            }
            let sum = 0;
            for (let i = 0; i < numbers.length; i++) {
                if (typeof numbers[i] !== 'number' || numbers[i] !== numbers[i]) {
                    Common.raise(TypeError, `expect only finite numbers and infinities`, env);
                }
                sum += numbers[i];
            }
            return sum / numbers.length;
        }
    ),

    log: Common.injectHelp(
        'log(a, b)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number, number];
            Common.checkArgs(args, env, 'math.log', 2, 2);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as base`, env);
            }
            if (args[0] <= 0 || args[0] === 1 || args[0] === Infinity) {
                Common.raise(RangeError, `invalid base`, env);
            }
            if (typeof args[1] !== 'number') {
                Common.raise(TypeError, `expect a number as natural number`, env);
            }
            if (args[1] <= 0) {
                Common.raise(RangeError, `invalid natural number`, env);
            }
            return Math.log(args[1]) / Math.log(args[0]);
        }
    ),

    ln: Common.injectHelp(
        'ln(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.ln', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as natural number`, env);
            }
            if (args[0] <= 0) {
                Common.raise(RangeError, `invalid natural number`, env);
            }
            return Math.log(args[0]);
        }
    ),

    lg: Common.injectHelp(
        'lg(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.lg', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as natural number`, env);
            }
            if (args[0] <= 0) {
                Common.raise(RangeError, `invalid natural number`, env);
            }
            return Math.log(args[0]) / Math.LN10;
        }
    ),

    sin: Common.injectHelp(
        'sin(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.sin', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.sin(args[0]);
        }
    ),

    cos: Common.injectHelp(
        'cos(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.cos', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.cos(args[0]);
        }
    ),

    tan: Common.injectHelp(
        'tan(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.tan', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.tan(args[0]);
        }
    ),

    csc: Common.injectHelp(
        'csc(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.csc', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return 1 / Math.sin(args[0]);
        }
    ),

    sec: Common.injectHelp(
        'sec(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.sec', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return 1 / Math.cos(args[0]);
        }
    ),

    cot: Common.injectHelp(
        'cot(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.cot', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return 1 / Math.tan(args[0]);
        }
    ),

    asin: Common.injectHelp(
        'asin(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.asin', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.asin(args[0]);
        }
    ),

    acos: Common.injectHelp(
        'acos(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.acos', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.acos(args[0]);
        }
    ),

    atan: Common.injectHelp(
        'atan(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.atan', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.atan(args[0]);
        }
    ),

    acsc: Common.injectHelp(
        'acsc(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.acsc', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.asin(1 / args[0]);
        }
    ),

    asec: Common.injectHelp(
        'asec(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.asec', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.acos(1 / args[0]);
        }
    ),

    acot: Common.injectHelp(
        'acot(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.acot', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.atan(1 / args[0]);
        }
    ),

    sinh: Common.injectHelp(
        'sinh(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.sinh', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.sinh(args[0]);
        }
    ),

    cosh: Common.injectHelp(
        'cosh(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.cosh', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.cosh(args[0]);
        }
    ),

    tanh: Common.injectHelp(
        'tanh(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.tanh', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.tanh(args[0]);
        }
    ),

    csch: Common.injectHelp(
        'csch(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.csch', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return 1 / Math.sinh(args[0]);
        }
    ),

    sech: Common.injectHelp(
        'sech(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.sech', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return 1 / Math.cosh(args[0]);
        }
    ),

    coth: Common.injectHelp(
        'coth(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.coth', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return 1 / Math.tanh(args[0]);
        }
    ),

    asinh: Common.injectHelp(
        'asinh(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.asinh', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.asinh(args[0]);
        }
    ),

    acosh: Common.injectHelp(
        'acosh(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.acosh', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.acosh(args[0]);
        }
    ),

    atanh: Common.injectHelp(
        'atanh(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.atanh', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.atanh(args[0]);
        }
    ),

    acsch: Common.injectHelp(
        'acsch(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.acsch', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.asinh(1 / args[0]);
        }
    ),

    asech: Common.injectHelp(
        'asech(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.asech', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.acosh(1 / args[0]);
        }
    ),

    acoth: Common.injectHelp(
        'acoth(x)',
        (rawArgs, context, env) => {
            const args = evalList(rawArgs, context, env.fileName) as [number];
            Common.checkArgs(args, env, 'math.acoth', 1, 1);
            if (typeof args[0] !== 'number') {
                Common.raise(TypeError, `expect a number as argument`, env);
            }
            return Math.atanh(1 / args[0]);
        }
    ),

});
