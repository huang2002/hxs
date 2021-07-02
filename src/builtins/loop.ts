import { FunctionHandler, Utils } from '../common';
import { evalExpression } from '../eval';
import { createFunctionHandler } from '../function';

export const builtinWhile: FunctionHandler = Utils.injectHelp(
    'while (condition) { ... }',
    (rawArgs, referer, context) => (

        createFunctionHandler(1, 1, (_args, _referer, _context) => {

            const callback = _args[0];
            if (typeof callback !== 'function') {
                Utils.raise(TypeError, 'expect a callback', _referer, _context);
            }

            const BREAK_FLAG = Symbol('hxs_break_flag');
            const CONTINUE_FLAG = Symbol('hxs_break_flag');

            Utils.injectTemp(
                _context.store,
                {
                    break: createFunctionHandler(0, 0, () => {
                        throw BREAK_FLAG;
                    }),
                    continue: createFunctionHandler(0, 0, () => {
                        throw CONTINUE_FLAG;
                    }),
                },
                () => {

                    while (true) {

                        const condition = evalExpression(rawArgs, context);
                        if (typeof condition !== 'boolean') {
                            Utils.raise(TypeError, 'expect a boolean as condition', referer, context);
                        }

                        if (!condition) {
                            break;
                        }

                        try {
                            (callback as FunctionHandler)([], referer, _context);
                        } catch (error) {
                            if (error === BREAK_FLAG) {
                                break;
                            } else if (error !== CONTINUE_FLAG) {
                                throw error;
                            }
                        }

                    }

                },
            );

            return null;

        })

    ));

export const builtinFor: FunctionHandler = Utils.injectHelp(
    'for (iteratorName, begin, end, step?) { ... }',
    createFunctionHandler(3, 4, (args, referer, context) => {

        const iteratorName = args[0] as string;
        if (typeof iteratorName !== 'string') {
            Utils.raise(TypeError, 'expect a string as iterator name', referer, context);
        }

        const begin = args[1] as number;
        if (!Number.isFinite(begin)) {
            Utils.raise(TypeError, 'expect a finite number as begin value', referer, context);
        }

        const end = args[2] as number;
        if (!Number.isFinite(end)) {
            Utils.raise(TypeError, 'expect a finite number as end value', referer, context);
        }

        const defaultStep = begin <= end ? 1 : -1;
        const step = args.length === 4
            ? args[3] as number
            : defaultStep;
        if (!Number.isFinite(step)) {
            Utils.raise(TypeError, 'expect a finite number as step', referer, context);
        }
        if (
            begin !== end
            && Math.sign(defaultStep) !== Math.sign(step)
        ) {
            Utils.raise(RangeError, 'invalid step', referer, context);
        }

        return createFunctionHandler(1, 1, (_args, _referer, _context) => {

            const callback = _args[0];
            if (typeof callback !== 'function') {
                Utils.raise(TypeError, 'expect a callback', _referer, _context);
            }

            const BREAK_FLAG = Symbol('hxs_break_flag');
            const CONTINUE_FLAG = Symbol('hxs_break_flag');

            Utils.injectTemp(
                _context.store,
                {
                    break: createFunctionHandler(0, 0, () => {
                        throw BREAK_FLAG;
                    }),
                    continue: createFunctionHandler(0, 0, () => {
                        throw CONTINUE_FLAG;
                    }),
                },
                () => {
                    if (step > 0) {
                        for (let iterator = begin; iterator < end; iterator += step) {
                            try {
                                _context.store.set(iteratorName, iterator);
                                (callback as FunctionHandler)([], referer, _context);
                            } catch (error) {
                                if (error === BREAK_FLAG) {
                                    break;
                                } else if (error !== CONTINUE_FLAG) {
                                    throw error;
                                }
                            }
                        }
                    } else {
                        for (let iterator = begin; iterator > end; iterator += step) {
                            try {
                                _context.store.set(iteratorName, iterator);
                                (callback as FunctionHandler)([], referer, _context);
                            } catch (error) {
                                if (error === BREAK_FLAG) {
                                    break;
                                } else if (error !== CONTINUE_FLAG) {
                                    throw error;
                                }
                            }
                        }
                    }
                },
            );

            return null;

        });

    })
);
